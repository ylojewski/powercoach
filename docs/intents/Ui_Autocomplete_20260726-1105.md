# Autocomplete

Q&A avec ds-dev en mode pm-advice
Moteur d'animation CSS

## Q1

Il me faudrait un composant Autocomplete qui serait l'exacte copie de celui de BaseUI mais avec l'identification Visuel de Powercoach (field-emphasis, label en Heading, Backdrop comme les stacked drawers, etc). Tu me conseilles quoi

## A1

Je te conseille une **copie contractuelle de Base UI, pas une copie de son code** : même anatomie, mêmes props, mêmes événements et même accessibilité, avec des styles Powercoach appliqués par défaut.

Le package utilise déjà Base UI 1.6.0, donc l’alignement peut être exact.

### Contrat recommandé

`Autocomplete` resterait un namespace multi-part calqué sur Base UI :

- `Root`, `InputGroup`, `Input`, `Trigger`, `Icon`, `Clear`, `Value`
- `Portal`, `Backdrop`, `Positioner`, `Popup`, `Arrow`
- `Status`, `Empty`, `List`, `Row`, `Item`
- `Group`, `GroupLabel`, `Separator`, `Collection`
- `useFilter` et `useFilteredItems`

Je préserverais aussi :

- l’inférence TypeScript depuis `items` ;
- `value/defaultValue`, `open/defaultOpen` et leurs callbacks Base UI ;
- les raisons d’événements et leur annulation ;
- les modes `list`, `both`, `inline`, `none` ;
- les variantes async, groupées, grille et command palette ;
- les attributs `data-highlighted`, `data-popup-open`, `data-empty`, les états Field et le cycle d’animation ;
- l’ARIA combobox, la navigation clavier et les annonces de `Status`/`Empty`.

### Identité Powercoach

Je ferais de `Autocomplete.InputGroup` un vrai champ Powercoach :

- géométrie carrée ;
- bordure fine ;
- rail visuel obligatoire ;
- `field-emphasis` au focus ;
- tailles cohérentes avec `Input` ;
- `Trigger` et `Clear` intégrés dans la zone de contrôle.

Le point à décider est l’API du rail. Base UI n’a pas cette notion. Je recommande un prop obligatoire sur `InputGroup`, par exemple `addOn`, plutôt qu’une icône arbitraire imposée par défaut.

Pour le label, il n’est pas nécessaire d’ajouter `Autocomplete.Label`. La composition naturelle serait :

```tsx
<Field.Root name="athlete">
  <Field.Label>Athlète</Field.Label>

  <Autocomplete.Root items={athletes}>
    <Autocomplete.InputGroup addOn={<SearchIcon />}>
      <Autocomplete.Input placeholder="Rechercher…" />
      <Autocomplete.Clear />
      <Autocomplete.Trigger>
        <Autocomplete.Icon />
      </Autocomplete.Trigger>
    </Autocomplete.InputGroup>

    <Autocomplete.Portal>
      <Autocomplete.Backdrop />
      <Autocomplete.Positioner>
        <Autocomplete.Popup>
          <Autocomplete.Empty>Aucun résultat</Autocomplete.Empty>
          <Autocomplete.List>
            {(athlete) => (
              <Autocomplete.Item value={athlete}>
                {athlete.name}
              </Autocomplete.Item>
            )}
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  </Autocomplete.Root>

  <Field.Description
    waitingKey="athlete-help"
    waitingContent="Saisissez un nom ou choisissez une suggestion."
  />
</Field.Root>
```

`Field.Label` fournit déjà le rendu `Heading` et les associations accessibles. Les `GroupLabel` de la popup devraient également utiliser `Heading`, probablement en `xs` ou `sm`.

### Backdrop

Je déconseille de réutiliser directement `BottomSheet.Backdrop` : il appartient au contexte Drawer et dépend de ses états de swipe et de stack.

En revanche, `Autocomplete.Backdrop` peut envelopper le primitive homonyme de Base UI et reprendre le langage visuel des stacked drawers :

- noir ;
- opacité `0.2` en light et `0.7` en dark ;
- transition d’entrée/sortie cohérente ;
- respect de `prefers-reduced-motion`.

Je réserverais ce backdrop au mode `modal`, notamment pour une command palette. Sur un autocomplete classique ancré sous un champ, le backdrop est inhabituel et peut rendre le formulaire inutilement bloquant. Si tu le veux systématiquement, il faut l’assumer comme une divergence produit explicite.

Pour ce simple fondu, ma recommandation est **CSS**, mais le moteur doit être confirmé dans l’intent.

Enfin, attention au choix du primitive : Base UI `Autocomplete` accepte une saisie libre et les propositions sont facultatives. Si l’utilisateur doit obligatoirement choisir une valeur existante, il faut faire exactement le même travail visuel sur `Combobox`, pas sur `Autocomplete`.

Les décisions PM restantes sont donc :

1. saisie libre ou sélection strictement contrainte ;
2. rail visuel obligatoire fourni par `addOn`, ou icône par défaut ;
3. backdrop seulement en modal ou à chaque ouverture ;
4. CSS ou Motion — je recommande CSS ;
5. support complet de toutes les capacités Base UI dès la première révision, ou premier périmètre limité aux listes plates/groupées.

## Q2

AddOn est une leaf d'Input, pourquoi ne pas faire pareil plutôt qu'une prop ?

## A2

Oui, tu as raison : une leaf `Autocomplete.AddOn` est plus cohérente qu’un prop `addOn`.

Je proposerais cette anatomie :

```tsx
<Autocomplete.Root items={athletes}>
  <Autocomplete.InputGroup size="xl">
    <Autocomplete.AddOn>
      <SearchIcon />
    </Autocomplete.AddOn>

    <Autocomplete.Input placeholder="Rechercher…" />
    <Autocomplete.Clear />
    <Autocomplete.Trigger>
      <Autocomplete.Icon />
    </Autocomplete.Trigger>
  </Autocomplete.InputGroup>

  {/* popup */}
</Autocomplete.Root>
```

Avec ce contrat :

- `InputGroup` exige exactement un `Autocomplete.AddOn` et un `Autocomplete.Input` ;
- `Clear` et `Trigger` restent optionnels ;
- `InputGroup` porte la taille et `field-emphasis` ;
- `AddOn` est décoratif, `aria-hidden`, inerte et positionné au début logique ;
- `Input` reste le seul contrôle textuel ;
- `Trigger` et `Clear` restent de vrais boutons Base UI.

Je n’utiliserais toutefois pas directement `Input.AddOn`. Son contrat actuel exige qu’il soit enfant d’`Input.Root`, dont l’anatomie n’accepte elle-même qu’un `Input.AddOn` et un `Input.Control`. Y insérer l’input, le trigger et le clear de l’Autocomplete violerait le contrat public d’`Input`.

`Autocomplete.AddOn` serait donc une leaf propre à la famille, mais alignée sur le même contrat visuel public :

- même rail Powercoach ;
- même attribut `data-field-addon` ;
- même réaction au `field-emphasis` ;
- mêmes tailles coordonnées ;
- mêmes garanties d’inertie et d’accessibilité.

C’est une petite extension assumée par rapport à l’anatomie Base UI, mais beaucoup plus propre qu’un prop spécial et plus naturelle pour les consommateurs du design system.

## Q3

Il faudrait aussi que visuellement L'input et l'addon d'autocomplete soit le même qu'input, avec la même prop de taille. est ce que c'est partageable ou faut-il  qu'autocomplete ait sa propre implémentation

## A3

C’est partageable, et je recommande de partager **la couche visuelle**, tout en laissant à `Autocomplete` sa propre implémentation comportementale.

`Autocomplete.Input` doit rester fondé sur Base UI Autocomplete : il possède les rôles ARIA, les états de popup, la navigation et le filtrage. Il ne peut donc pas être remplacé par `Input.Control`. Même chose pour `Autocomplete.InputGroup` et ses boutons.

En revanche, les éléments suivants devraient devenir un contrat visuel commun :

- surface carrée et bordure ;
- `field-emphasis` ;
- rail AddOn ;
- métriques de taille ;
- typographie, padding et tailles d’icônes ;
- variables CSS et `data-size`.

Je recommande de généraliser le contrat CSS public existant plutôt que d’ajouter un composant `FieldSurface`, qui introduirait des wrappers et compliquerait l’anatomie Base UI.

L’API serait cohérente :

```tsx
<Input.Root size="md">
  <Input.AddOn>
    <UserIcon />
  </Input.AddOn>
  <Input.Control />
</Input.Root>
```

```tsx
<Autocomplete.InputGroup size="md">
  <Autocomplete.AddOn>
    <UserIcon />
  </Autocomplete.AddOn>
  <Autocomplete.Input />
  <Autocomplete.Clear />
  <Autocomplete.Trigger />
</Autocomplete.InputGroup>
```

Les deux produiraient exactement :

- la même hauteur ;
- la même largeur de rail ;
- les mêmes espacements ;
- la même taille d’icône ;
- la même translation et la même ombre au focus ;
- le même comportement en réduction de mouvement.

Je ferais également remonter la taille au niveau sémantique partagé :

```ts
type FieldSize = 'xs' | 'md' | 'xl'
type InputSize = FieldSize
type AutocompleteSize = FieldSize
```

`Input.Root.size` et `Autocomplete.InputGroup.size` auraient donc les mêmes valeurs, le même défaut `xl` et les mêmes métriques garanties.

À éviter :

- importer les CVA privées d’`Input` depuis `Autocomplete` ;
- rendre `Input.AddOn` en dehors d’`Input.Root` ;
- copier les classes d’Input dans Autocomplete ;
- faire dépendre publiquement `AutocompleteSize` d’un concept nommé `InputSize`.

Donc : **implémentations de leaves distinctes, contrat visuel et échelle de taille partagés**. Cela nécessite une petite révision coordonnée d’`Input` en plus de la création d’`Autocomplete`, mais garantit qu’ils ne pourront pas dériver visuellement.

## Q4

De même pour le backdrop et le popup d'autocomplete, je souhaite la même ombre que les drawer qui sont stackés. Partageable ou propre implem ?

## A4

Oui, c’est partageable, mais il faut partager **le résultat visuel**, pas les composants `BottomSheet`.

Si je comprends bien :

- `Autocomplete.Backdrop` reprend le noir et les opacités light/dark du backdrop des drawers ;
- `Autocomplete.Popup` reprend l’ombre dure `0.25rem 0.25rem 0 foreground` des drawers empilés.

Les implementations restent propres à chaque famille :

- `BottomSheet.Backdrop` dépend du contexte Drawer, du swipe et de `--drawer-swipe-progress` ;
- `Autocomplete.Backdrop` dépend du cycle `open/closed` de Base UI Autocomplete ;
- les deux peuvent consommer les mêmes variables ou utilitaires visuels publics.

Même principe pour le popup :

- `BottomSheet.Popup` conserve ses transformations de stack ;
- `Autocomplete.Popup` conserve son positionnement, ses collisions et ses états Base UI ;
- l’ombre provient d’un contrat commun, par exemple une utility publique d’ombre dure.

Je déconseille d’appliquer directement `field-emphasis` au popup : cette utility apporte aussi translation, focus et traitement du rail. Il faudrait en extraire le résultat d’ombre dans un contrat visuel plus élémentaire, consommé ensuite par :

- `field-emphasis` ;
- le popup d’arrière-plan des drawers empilés ;
- `Autocomplete.Popup`.

Pour le backdrop, on pourrait partager :

- couleur noire ;
- opacité `0.2` en light ;
- opacité `0.7` en dark.

Mais chaque famille garderait son animation propre : BottomSheet module l’opacité avec le swipe, tandis qu’Autocomplete anime seulement l’ouverture et la fermeture.

Donc ma recommandation globale est :

> leaves Base UI distinctes, apparence statique partagée, cycle d’état propre à chaque famille.

Comme l’ombre et le backdrop de BottomSheet ne sont pas encore des primitives visuelles publiques, leur promotion nécessitera une révision coordonnée de `BottomSheet` avec la création d’`Autocomplete`. Le rendu de BottomSheet ne changerait pas ; seule la source contractuelle de ses valeurs deviendrait commune.

## Q5

Maintenant l'animation de la popup, j'ai vu sur la doc base-ui qu'il y a tout un pan là-dessus, est-il possible de reprendre celle qu'on voit dans le premier exemple de Combobox, elle me convient très bien

## A5

Oui, elle est directement transposable à `Autocomplete.Popup`. Base UI Autocomplete expose exactement les mêmes mécanismes que Combobox :

- `--transform-origin` fourni par `Positioner` ;
- `data-starting-style` à l’ouverture ;
- `data-ending-style` à la fermeture ;
- attente automatique de la transition avant démontage.

L’animation du premier exemple Combobox est :

```txt
état ouvert : scale 1, opacity 1
entrée       : scale 0.95, opacity 0
sortie       : scale 0.95, opacity 0
durée        : 100 ms
propriétés   : scale et opacity
origine      : --transform-origin
easing       : easing Tailwind par défaut
```

Le contrat visuel d’`Autocomplete.Popup` peut donc être :

```tsx
<Autocomplete.Popup
  className="
    origin-[var(--transform-origin)]
    transition-[scale,opacity] duration-100
    data-starting-style:scale-95 data-starting-style:opacity-0
    data-ending-style:scale-95 data-ending-style:opacity-0
    motion-reduce:duration-0
  "
/>
```

L’origine suit automatiquement la position réelle de la popup. Si Base UI la fait basculer du bas vers le haut pour éviter une collision, le scale partira du bon côté.

Cette décision établit aussi le moteur d’animation : **CSS**. Je garderais ce mouvement local à `Autocomplete.Popup` plutôt que d’en faire immédiatement une animation Powercoach nommée : c’est un simple traitement du cycle Base UI et nous n’avons pas encore un deuxième consommateur Powercoach nécessitant un contrat réutilisable.

L’ombre dure partagée reste présente pendant l’animation et atteint son rendu complet à `scale(1)`.

Pour conserver un ensemble cohérent, je recommande que le backdrop d’Autocomplete utilise l’apparence statique des drawers, mais un fondu de **100 ms synchronisé avec la popup**, plutôt que leur transition de 450 ms liée au geste de drawer. Ainsi, on partage l’identité visuelle sans importer la dynamique beaucoup plus lourde d’un panneau glissable.

## Q6

Pour les group, j'aimerais reprendre Heading avec une size proportionnelle à la taille passée en prop et en muted tone, possible ? Un mapping du genre size xs -> heading xs, size md -> heading sm, size xl -> heading md serait pas mal

## A6

Oui, et ton mapping est cohérent :

| Taille Autocomplete | Taille Heading |
|---|---|
| `xs` | `xs` |
| `md` | `sm` |
| `xl` | `md` |

`Autocomplete.GroupLabel` composerait toujours le `Heading` public avec `tone="muted"`, tout en conservant l’association accessible fournie par Base UI `GroupLabel`.

Cette exigence révèle toutefois que `size` devrait appartenir à `Autocomplete.Root`, et non uniquement à `InputGroup` :

```tsx
<Autocomplete.Root size="md" items={groupedItems}>
  <Autocomplete.InputGroup>
    <Autocomplete.AddOn>
      <SearchIcon />
    </Autocomplete.AddOn>
    <Autocomplete.Input />
  </Autocomplete.InputGroup>

  <Autocomplete.Portal>
    <Autocomplete.Positioner>
      <Autocomplete.Popup>
        <Autocomplete.List>
          <Autocomplete.Group>
            <Autocomplete.GroupLabel>Catégorie</Autocomplete.GroupLabel>
          </Autocomplete.Group>
        </Autocomplete.List>
      </Autocomplete.Popup>
    </Autocomplete.Positioner>
  </Autocomplete.Portal>
</Autocomplete.Root>
```

La raison : `GroupLabel` se trouve dans le Portal, qui est un frère d’`InputGroup`. Une taille portée seulement par `InputGroup` ne peut pas devenir proprement le réglage commun de toute la famille. Placée sur `Root`, elle reste disponible dans le Portal puisque les portals React préservent le contexte.

La taille coordonnerait alors :

- `InputGroup` ;
- `AddOn` ;
- `Input` ;
- `Clear`, `Trigger` et `Icon` ;
- les espacements de `Popup`, `List` et `Item` si souhaité ;
- `GroupLabel` via le mapping Heading.

Je rendrais `size` et `tone` de `GroupLabel` non configurables directement : ils sont dérivés du contrat Powercoach. Ses `className`, `style`, `render`, ref et état Base UI resteraient préservés, mais sans prop visuelle concurrente.

Le rendu final garderait la sémantique et l’identifiant accessible de Base UI, la typographie lowercase visuelle de `Heading`, et le texte source inchangé pour les technologies d’assistance.

## Q7

Ok, dans ce cas la taille du texte dans les items de la popup doit aussi suivre cette taille j'imagine. on aurait un size xs -> text xs, size md -> text-sm et size xl -> text-md. On peut peut-être utiliser Text d'ailleurs

## A7

Oui, `Text` est le bon composant à réutiliser. Il expose déjà exactement `xs`, `sm` et `md`, avec la typographie Powercoach et la composition `render`.

Le mapping serait :

| Taille Autocomplete | `Item` avec Text | `GroupLabel` avec Heading |
|---|---|---|
| `xs` | `Text size="xs"` | `Heading size="xs"` |
| `md` | `Text size="sm"` | `Heading size="sm"` |
| `xl` | `Text size="md"` | `Heading size="md"` |

`Autocomplete.Item` composerait automatiquement le composant public `Text`, tout en laissant Base UI posséder le rôle option, les événements, le ref et `data-highlighted`.

Conceptuellement :

```tsx
<Autocomplete.Root size="md">
  {/* ... */}

  <Autocomplete.Item value={athlete}>
    {athlete.name}
  </Autocomplete.Item>
</Autocomplete.Root>
```

produirait un item en `Text size="sm"` sans que le consommateur doive le préciser.

Je fixerais :

- `Item` : `Text` avec le tone par défaut ;
- `GroupLabel` : `Heading tone="muted"` ;
- `Empty` et `Status` : `Text tone="muted"` avec le même mapping que les items.

Les styles d’état resteraient portés par `Autocomplete.Item` :

- texte normal en foreground ;
- item surligné avec inversion foreground/background ;
- disabled distinct visuellement ;
- aucune modification du texte source ou accessible.

Je ne mettrais pas de prop `size` sur `Item`, `Empty`, `Status` ou `GroupLabel`. Elle serait toujours dérivée de `Autocomplete.Root.size`, pour éviter une popup composée de densités incohérentes.

Les consommateurs conserveraient néanmoins `className`, `style`, `render` et les callbacks d’état Base UI. `Text` servirait de couche typographique, sans remplacer la sémantique interactive de `Autocomplete.Item`.

## Q8

On peut toujours utiliser render pour des item plus complexes que Text ?

## A8

Oui. `Text` serait la couche typographique du **root de l’item**, pas une contrainte sur son contenu.

Pour un contenu complexe, aucun `render` n’est nécessaire :

```tsx
<Autocomplete.Item value={athlete}>
  <Avatar src={athlete.avatar} />
  <div>
    <Text>{athlete.name}</Text>
    <Text size="xs" tone="muted">
      {athlete.team}
    </Text>
  </div>
  <Badge>{athlete.status}</Badge>
</Autocomplete.Item>
```

La taille dérivée d’`Autocomplete.Root` fournit la typographie par défaut de l’item. Les descendants peuvent utiliser leurs propres composants et tailles.

`render` reste disponible pour remplacer l’élément racine :

```tsx
<Autocomplete.Item
  value={athlete}
  render={(props, state) => (
    <a
      {...props}
      href={`/athletes/${athlete.id}`}
      data-active={state.highlighted ? '' : undefined}
    />
  )}
>
  <Avatar src={athlete.avatar} />
  <span>{athlete.name}</span>
</Autocomplete.Item>
```

Le rendu personnalisé reçoit toujours :

- les props ARIA et événements de Base UI ;
- le `ref` ;
- les `children` ;
- les états `highlighted` et `disabled` ;
- les classes typographiques de `Text` ;
- les traitements visuels Powercoach de sélection.

Pour un composant personnalisé, il devra transmettre le `ref` et toutes les props à son élément final. Si le remplacement est un vrai `<button>`, `nativeButton` devra rester aligné avec le contrat Base UI.

Ainsi, on conserve toute la souplesse de Base UI : `Text` donne le défaut visuel, mais `children` et `render` restent totalement composables.
