# LoadingCover

Q&A avec ds-dev en mode pm-advice

## Q1

il faudrait migrer / réécrire / importer le composant apps/manager/src/core/components/LoadingTransition.tsx qui utilise en interne le composant apps/manager/src/core/components/LoadingOverlay.tsx mais peut-être qu'on peut utiliser RevealAnimation en mode "continue" pour reproduire le résultat ?

## A1

Oui, `RevealAnimation` avec `unrevealBehavior="continue"` reproduit très bien la trajectoire visuelle, mais il ne remplace pas à lui seul `LoadingTransition`.

| Comportement actuel | RevealAnimation |
|---|---|
| Entrée gauche → droite | Oui avec `direction="left-to-right"` |
| Sortie poursuivant vers la droite | Oui avec `unrevealBehavior="continue"` |
| Couleurs inversées et logo | Compatible via une surface dédiée et `scale={1}` |
| Durée minimale de 1 s | Non, à gérer par `LoadingTransition` |
| Masquage/démontage des enfants | Non, Reveal est décoratif et laisse sa surface réelle visible |
| Overlay viewport ou contenu dans un parent | Non, le placement et le portail restent à la charge du composant |
| Blocage des interactions | Non, l’overlay Reveal est toujours sans interaction |
| Sémantique de chargement | Non, Reveal n’expose aucun état de chargement |

La sortie correspond exactement aux mêmes géométries de clip-path : l’ancien code va de `inset(0 0 0 0)` à `inset(0 0 0 100%)`, qui est précisément la sortie « continue » gauche → droite de Reveal. Voir [globals.css](./apps/manager/src/styles/globals.css:14) et [RevealAnimation.md](./packages/ui/docs/design-system/animations/RevealAnimation.md:561).

Ma recommandation serait donc :

- Réécrire un composant public mono-partie `LoadingTransition` dans Powercoach UI.
- Garder `LoadingOverlay` comme éventuel détail interne, sans l’exposer publiquement.
- Composer le `RevealAnimation` public au lieu de recopier ses clip-paths.
- Laisser `LoadingTransition` posséder le cycle de chargement : durée minimale, apparition initiale, montage des enfants, placement viewport/conteneur, portail, blocage des interactions et démontage final.

La composition utiliserait conceptuellement un Reveal contrôlé, gauche → droite, échelle 1 et sortie continue. Il faudra toutefois provoquer une transition caché → révélé après le montage : un Reveal monté directement avec `reveal={true}` est immédiatement considéré comme complètement révélé et n’anime pas son entrée ([contrat](./packages/ui/docs/design-system/animations/RevealAnimation.md:486)).

Il existe aussi une différence de mouvement à décider :

- Legacy : 400 ms, `ease-in-out` ([globals.css](./apps/manager/src/styles/globals.css:68)).
- RevealAnimation : 300 ms, `cubic-bezier(0.4, 0, 0.2, 1)` ([RevealAnimation.md](./packages/ui/docs/design-system/animations/RevealAnimation.md:580)).

Je recommande d’adopter le mouvement canonique de Reveal plutôt que d’élargir son API uniquement pour conserver les 400 ms legacy. Dans ce cas, aucune révision de RevealAnimation ne semble nécessaire : seulement une nouvelle spec `LoadingTransition`, déclarant explicitement le moteur CSS et sa composition avec Reveal.

Décisions produit encore nécessaires avant spécification :

- adopter les 300 ms de Reveal ou exiger la parité legacy ;
- conserver ou non la durée minimale de 1 000 ms, notamment en reduced motion ;
- démonter les enfants pendant le chargement comme aujourd’hui, ou les garder montés derrière l’overlay ;
- conserver `contained` ou adopter une API plus explicite de type viewport/conteneur ;
- annoncer ou non le chargement aux technologies d’assistance — l’actuel `aria-label` sur un `div` ne définit pas véritablement un statut de chargement ;
- lors d’un nouveau chargement pendant la sortie, adopter la reprise fluide de Reveal ou reproduire le redémarrage legacy.

En bref : réécriture DS de `LoadingTransition`, réutilisation de Reveal en `continue`, et suppression des keyframes propres au manager — mais pas remplacement direct par Reveal seul.

## Q2

Nan l'idée c'est de fusionner tout ça en un seul composant et d'utiliser reveal en interne

## A2

Oui, compris : un unique composant public `LoadingTransition`, qui absorbe entièrement `LoadingOverlay` et compose `RevealAnimation` en interne.

```tsx
<LoadingTransition loading={loading} contained>
  {children}
</LoadingTransition>
```

Le composant posséderait :

- le délai minimal de 1 000 ms ;
- le montage et le masquage des enfants ;
- le mode plein écran ou contenu ;
- le portail, le blocage des interactions et l’accessibilité ;
- le logo et la surface de chargement ;
- un `RevealAnimation` interne contrôlé, avec `direction="left-to-right"`, `unrevealBehavior="continue"` et `scale={1}`.

Donc :

- suppression complète de `LoadingOverlay` ;
- aucune nouvelle API publique pour l’overlay ;
- aucune duplication des keyframes dans `LoadingTransition` ;
- les détails de Reveal ne remontent pas dans les props publiques ;
- une seule spec et une seule famille `LoadingTransition`.

La seule décision restante est la fidélité du mouvement : conserver les 400 ms legacy nécessiterait d’étendre Reveal, tandis que réutiliser Reveal tel quel donnerait le mouvement canonique de 300 ms. Je recommande ce dernier.

## Q3

mode contained par défaut, et pour les 1000 je sais pas, peut-être dans un premier temps juste faire en sorte d'attendre que le reveal soit complet pour unreveal même si entre temps loading passe à false. Pour le logo pour faire une leaf à part ou on migre d'abord le comp Logo ?

## A3

Oui, ça clarifie bien le contrat.

`LoadingTransition` serait contenu par défaut ; le plein écran deviendrait explicitement `contained={false}`. Pour la première version, je supprimerais les 1 000 ms et garderais seulement cette garantie :

1. `loading` passe à `true` : le reveal d’entrée commence.
2. `loading` repasse à `false` pendant l’entrée : la demande est mémorisée, mais l’entrée continue.
3. Le reveal est complètement visible : le contenu peut apparaître derrière lui, puis l’unreveal `continue` démarre.
4. L’unreveal terminé : l’overlay disparaît.
5. Si `loading` revient à `true` pendant la sortie, Reveal reprend vers l’état complètement révélé depuis sa géométrie courante.

En reduced motion, les complétions sont immédiates, sans délai artificiel.

Pour le logo, je recommande de migrer d’abord `LogoIcon`, pas de créer une leaf `LoadingTransition.Logo`. Le composant actuel est encore legacy : il dépend de Coss, n’a pas de spec ni de story et reste dans l’ancienne structure ([LogoIcon.tsx](./packages/ui/src/components/LogoIcon.tsx:1)).

Le découpage serait donc :

- `LogoIcon` : composant public mono-partie migré et propriétaire du SVG de marque.
- `LoadingTransition` : composant public mono-partie qui compose `LogoIcon` et `RevealAnimation`.
- Aucun `LoadingOverlay`.
- Aucun `LoadingTransition.Logo`.
- Pas besoin de migrer immédiatement le logo horizontal `Logo`, puisque le loader ne l’utilise pas.

Une leaf dédiée ne serait justifiée que si les consommateurs devaient remplacer ou repositionner publiquement l’indicateur. Le comportement actuel impose le logo Powercoach, donc l’exposer ajouterait une API sans besoin établi.

## Q4

je ferai plutôt une prop fullscreen plutôt que contained non ?
pourquoi pas une leaf logo qui consomme Logo par défaut ?
t'as pas autre chose que LoadingTransition ?

## A4

Oui, `fullscreen` est meilleur ici : le comportement local est le défaut, et le plein écran devient une capacité explicite.

```tsx
<LoadingCover.Root loading fullscreen>
  {children}
</LoadingCover.Root>
```

Pour le logo, une leaf est défendable si elle constitue un vrai point de personnalisation. Je verrais alors :

- `LoadingCover.Root` : cycle `loading`, Reveal, placement et contenu.
- `LoadingCover.Logo` : représentation centrale par défaut.
- `Root` utilise automatiquement `Logo` ou `LogoIcon`, avec une prop permettant de remplacer/configurer cette leaf.

Attention : le loader actuel utilise `LogoIcon`, pas le logo horizontal ([LoadingOverlay.tsx](./apps/manager/src/core/components/LoadingOverlay.tsx:62)). Passer au composant `Logo` serait donc un changement visuel volontaire. On peut migrer la famille Logo dans le même lot si elle devient une dépendance publique ; créer une copie spécifique dans le loader serait moins propre.

Pour le nom, ma préférence est `LoadingCover` :

- ça décrit ce que voit l’utilisateur ;
- ça fonctionne autant localement qu’en `fullscreen` ;
- ça n’expose pas le détail d’implémentation `RevealAnimation` ;
- `LoadingCover.Logo` sonne naturellement.

Autres options :

- `LoadingReveal` : plus identitaire, mais couple le nom au mouvement ;
- `LoadingOverlay` : familier, mais décrit seulement la couche visuelle ;
- `LoadingCurtain` : décrit très bien la traversée continue, mais plus métaphorique ;
- `LoadingSplash` : adapté au démarrage global, moins au chargement contenu dans un drawer.

Je partirais donc sur `LoadingCover`, `fullscreen={false}` par défaut, sans délai minimal, avec la garantie que l’entrée Reveal se termine toujours avant le début de la sortie.

## Q5

Va pour LoadingCover
Maintenant plus compliqué, j'aimerais que les LoadingCover puissent être imbriqués et que le LoadingCover "root" puisse unreveal que si les nested LoadingCover le sont

## A5

Oui. `LoadingCover.Root` devient alors une barrière de chargement hiérarchique.

La règle pourrait être :

```text
Le parent peut commencer son unreveal si :
- son propre loading vaut false ;
- son reveal d’entrée est terminé ;
- tous ses LoadingCover descendants sont complètement unrevealed.
```

« Unrevealed » signifie que la sortie du nested cover est terminée, pas simplement que son `loading` vaut `false`.

Comportement recommandé :

- Chaque cover dépend de son ancêtre `LoadingCover.Root` le plus proche. La coordination devient récursive naturellement.
- Plusieurs nested covers bloquent le parent jusqu’à ce qu’ils soient tous sortis.
- Un nested cover démonté est considéré comme terminé.
- Un nested `fullscreen` participe quand même à la coordination : l’imbrication suit l’arbre React, pas la position DOM du portail.
- Un nested cover ne doit pas réveiller un parent déjà complètement inactif. Il ne bloque que le cycle de sortie déjà actif du parent.
- S’il devient actif pendant l’unreveal du parent, le parent interrompt sa sortie et revient vers l’état révélé, puis attend sa sortie complète.

Exemple :

```text
Parent : loading=false, reveal complet
Child A : unrevealed
Child B : unrevealing
→ Parent reste entièrement couvert

Child B : unrevealed
→ Parent démarre son unreveal continue
```

Conséquence importante : les enfants du parent doivent être montés derrière sa surface avant sa sortie, sinon les nested covers n’existent pas et ne peuvent pas participer. `LoadingCover` devrait donc couvrir et neutraliser ses enfants, mais pas les supprimer comme le composant legacy. Le consommateur reste libre de ne fournir son contenu que lorsqu’il est prêt.

Je recommande aussi un état public inspectable du type `data-loading-cover-state="hidden | revealing | revealed | unrevealing"`. La coordination reste automatique, sans prop de registre ni callback demandé au consommateur.

Il reste un choix d’accessibilité : si le logo ou le cover annonce le chargement, seul le cover extérieurement visible devrait être annoncé ; les nested covers masqués derrière lui ne devraient pas multiplier les annonces.

## Q6

Est ce qu'on pourrait pas mettre ça dans une leaf "Group" ou autre, au dessus de root, qui encode ce comportement, de façon à ce que je conso puisse choisir ou non de l'utiliser

## A6

Oui, c’est même plus propre : `Root` reste autonome par défaut et `Group` active explicitement la coordination hiérarchique.

```tsx
<LoadingCover.Group>
  <LoadingCover.Root loading={pageLoading} fullscreen>
    <Page>
      <LoadingCover.Root loading={panelLoading}>
        <Panel />
      </LoadingCover.Root>
    </Page>
  </LoadingCover.Root>
</LoadingCover.Group>
```

Sans `Group`, les covers imbriqués restent indépendants :

```tsx
<LoadingCover.Root loading={pageLoading}>
  <LoadingCover.Root loading={panelLoading}>
    <Panel />
  </LoadingCover.Root>
</LoadingCover.Root>
```

Je définirais `Group` ainsi :

- aucune apparence ni animation propre ;
- active la coordination pour les `Root` de son arbre ;
- un parent attend uniquement ses descendants, jamais ses frères ;
- chaque parent attend que ses enfants directs soient complètement unrevealed ; la récursion couvre tous les niveaux ;
- un nested cover n’active pas un parent déjà inactif ;
- un nested cover actif pendant la sortie du parent interrompt cette sortie ;
- `fullscreen` et les portails ne cassent pas la relation ;
- hors `Group`, `Root` dépend seulement de son propre `loading`.

`Group` me paraît préférable à `Barrier` : le second décrit mieux le mécanisme, mais `Group` est plus naturel côté consommation et existe déjà comme nom de leaf dans le DS.

L’anatomie devient donc légitimement multi-partie :

- `LoadingCover.Group`
- `LoadingCover.Root`
- `LoadingCover.Logo`

Le point restant à trancher est le comportement de plusieurs `Group` imbriqués. Pour une première version, je les déclarerais non supportés afin d’éviter une sémantique ambiguë entre isolation et propagation.

## Q7

T'as quoi à proposer comme nom plutôt que Group qui évoque cette gestion imbriquées ?

## A7

Mon choix serait `LoadingCover.Cascade`.

```tsx
<LoadingCover.Cascade>
  <LoadingCover.Root loading={pageLoading} fullscreen>
    <LoadingCover.Root loading={panelLoading}>
      <Panel />
    </LoadingCover.Root>
  </LoadingCover.Root>
</LoadingCover.Cascade>
```

Le nom évoque que la complétion remonte des covers internes vers les covers externes. Il reste compréhensible sans exposer le mécanisme technique.

Autres bons candidats :

- `LoadingCover.Boundary` : insiste sur la portée opt-in ; mon second choix.
- `LoadingCover.Barrier` : décrit précisément l’attente des descendants, mais sonne plus technique.
- `LoadingCover.Sync` : simple, mais ne communique pas spécialement l’imbrication.
- `LoadingCover.Stack` : évoque les couches imbriquées, mais pourrait être confondu avec le z-index.
- `LoadingCover.Coordinator` : explicite, mais trop orienté implémentation.

J’éviterais `Tree`, qui pourrait suggérer une sémantique ARIA de tree, et `Sequence`, car plusieurs covers frères peuvent évoluer en parallèle.

Donc : `Cascade` pour exprimer l’ordre descendant → parent, ou `Boundary` si tu préfères exprimer avant tout la portée de coordination.

## Q8

ok, pourquoi on pourrait pas gérer les Cascade nested ? si on part du principe qu'un Cascade imbriqué n'est qu'un "meta" LoadingCover, c'est comme si les Cascade du dessus n'en voyait "qu'un" non ? Chacun aurait son contexte qui "bubble" up non ?

## A8

Oui, exactement. Avec ce modèle, les `Cascade` imbriqués sont composables sans ambiguïté. Ma réserve précédente était trop conservatrice.

```text
Cascade A
└── Root parent
    └── Cascade B
        ├── Root enfant 1
        └── Root enfant 2
```

`Cascade B` agrège ses membres :

```text
Cascade B est résolue
⇔ Root enfant 1 est hidden
et Root enfant 2 est hidden
```

Puis elle se présente à son parent comme un unique participant. Le `Root parent` ne connaît donc ni le nombre ni la profondeur des covers contenus dans `Cascade B`.

Petite précision technique : le contexte React ne « bubble » pas lui-même. Chaque `Cascade` fournit un nouveau contexte vers le bas et rapporte son état agrégé au coordinateur immédiatement supérieur. Le résultat correspond bien à ton modèle de méta-`LoadingCover`.

Pour que ce soit robuste :

- chaque `Root` ou `Cascade` se rapporte uniquement à son parent coordinateur immédiat ;
- une `Cascade` vide est résolue ;
- une `Cascade` démontée libère son parent ;
- une `Cascade` est non résolue tant qu’un membre révèle, reste révélé ou unreveal ;
- l’ajout d’un membre pendant la sortie du parent rend immédiatement la Cascade non résolue et fait revenir le parent vers révélé ;
- les portails `fullscreen` conservent la relation, puisqu’elle suit l’arbre React ;
- une Cascade non résolue ne réactive toujours pas un Root parent déjà complètement caché et hors cycle.

Ça donne une récursion sans limite conceptuelle :

```text
Root attend Cascade
Cascade attend ses membres
Un membre peut être un Root ou une Cascade
```

Donc oui : les `LoadingCover.Cascade` imbriqués devraient faire partie du contrat initial. C’est même ce qui justifie vraiment le nom `Cascade`.

## Q9

Qu'est ce qui reste à éclaircir ?

## A9

Le cœur est maintenant clair. Il reste surtout six décisions de contrat public.

Déjà acté :

- `LoadingCover.Cascade`, `.Root` et `.Logo`.
- Mode local par défaut, `fullscreen` opt-in.
- `RevealAnimation` interne, entrée complète obligatoire avant toute sortie.
- Pas de délai artificiel de 1 000 ms.
- Sortie `continue`.
- Cascades récursives : une Cascade imbriquée remonte comme un participant agrégé.
- Sans Cascade, les Root sont indépendants.

À éclaircir :

1. Montage du contenu

Les enfants restent-ils toujours montés derrière le cover, ou apparaissent-ils seulement lorsque le chargement local finit ?

Je recommande de les garder montés : c’est le modèle le plus naturel pour permettre aux nested covers de s’enregistrer. Un consommateur ayant une dépendance stricte pourra conditionner lui-même son contenu.

2. Contrat de `Logo`

Il faut choisir :

- `LoadingCover.Logo` utilise `LogoIcon`, comme le loader actuel ;
- ou utilise le logo horizontal `Logo`, ce qui change le visuel.

Il faut également décider si le Root rend automatiquement cette leaf, ou si elle est composée explicitement, et si elle peut être remplacée ou retirée.

3. Réactivation et interruptions

À confirmer :

- une Cascade active ne révèle pas un parent déjà complètement inactif ;
- si elle devient active pendant la sortie du parent, celui-ci revient vers révélé ;
- une Cascade vide ou démontée est considérée comme résolue.

Ce sont mes recommandations.

4. Interactions et accessibilité

- Les enfants deviennent-ils interactifs dès le début de l’unreveal ou seulement à sa fin ?
- Le cover annonce-t-il un chargement ou reste-t-il décoratif ?
- En cas d’annonce, seul le cover extérieurement visible devrait parler, pas les nested covers masqués.

5. Placement `fullscreen`

Il reste à formaliser que :

- `fullscreen={false}` couvre le conteneur local, qui doit établir son positionnement ;
- `fullscreen` couvre le viewport via un portail ;
- un Root fullscreen conserve son appartenance à sa Cascade React.

6. Surface publique d’observation

Je recommande :

- `data-loading-cover-state="hidden | revealing | revealed | unrevealing"` sur Root ;
- aucun callback LoadingCover supplémentaire pour commencer ;
- les callbacks internes de Reveal ne sont pas exposés.

Enfin, la spec devra nommer explicitement le moteur `CSS`, même si ce choix découle déjà fonctionnellement de l’utilisation de `RevealAnimation`.

## Q10

1. c'est quoi le comportement du comp qu'on migre ?
2. on va utiliser le logo legacy dans un premier temps et faire la migration après
3. rien compris. c'est quoi une cascade active, inactive, vide ?
4. dès le début, oui on annonce un chargement
5. oui
6. alors je préfère que root ait une prop revealAnimationsProps comme on fait sur les autres, pour les data à toi de voir

## A10

1. Comportement du composant legacy

Le composant actuel :

- démonte ses enfants pendant `loading=true` ;
- affiche un fond neutre pendant l’entrée ;
- fait entrer le cover de gauche à droite en 400 ms ;
- si `loading` repasse à `false` pendant l’entrée, termine quand même l’entrée ;
- monte ensuite les enfants derrière le cover ;
- attend actuellement un minimum de 1 000 ms ;
- commence la sortie continue vers la droite ;
- rend les enfants interactifs dès le début de cette sortie ;
- démonte le cover à la fin ;
- utilise le mode fullscreen et le portail par défaut, contrairement à notre nouveau contrat.

Voir [LoadingTransition.tsx](./apps/manager/src/core/components/LoadingTransition.tsx:14) et [LoadingOverlay.tsx](./apps/manager/src/core/components/LoadingOverlay.tsx:47).

Pour préserver ce comportement tout en permettant les Cascades, je propose :

1. Pendant le chargement propre du Root, ses enfants restent démontés.
2. Une fois `loading=false` et l’entrée complètement terminée, les enfants sont montés derrière le cover opaque.
3. Les éventuels nested LoadingCover démarrent et se déclarent alors.
4. Le parent attend leur sortie complète avant de commencer la sienne.

On retire seulement les 1 000 ms.

2. Logo legacy

Acté : `LoadingCover.Logo` consomme d’abord le `LogoIcon` legacy actuellement utilisé. Sa migration viendra plus tard sans modifier l’API de LoadingCover.

Il reste uniquement à préciser si `Root` rend automatiquement cette leaf ou si le consommateur doit la composer explicitement.

3. Cascade, sans jargon

`Cascade` ne charge rien et ne s’anime pas. Elle sert uniquement à faire attendre les covers parents.

```tsx
<LoadingCover.Cascade>
  <LoadingCover.Root loading={pageLoading}>
    <LoadingCover.Root loading={panelLoading}>
      <Panel />
    </LoadingCover.Root>
  </LoadingCover.Root>
</LoadingCover.Cascade>
```

Concrètement :

- Si le cover parent veut sortir mais que celui du panel est encore visible, le parent attend.
- Lorsque le panel a complètement terminé sa sortie, le parent peut sortir.
- Si aucun nested cover n’existe, le parent n’attend rien.
- Si le parent est déjà complètement retiré et que le panel recharge plus tard, seul le panel se couvre.
- Si le panel recharge pendant que le parent est en train de sortir, le parent revient couvert, attend le panel, puis ressort.

Les Cascades imbriquées appliquent exactement cette règle récursivement.

4. Interactions et annonce

Acté :

- les interactions sont libérées dès le début de l’unreveal ;
- LoadingCover annonce le chargement.

Il reste à choisir le texte annoncé. Je recommande `Loading` par défaut, remplaçable avec `aria-label`. La surface pourrait porter `aria-busy` et un statut live. Pour les covers imbriqués, je recommande que seul celui visuellement au-dessus annonce, afin d’éviter plusieurs annonces simultanées.

5. Fullscreen

Acté :

- local par défaut ;
- `fullscreen` utilise un portail et couvre le viewport ;
- le portail conserve l’appartenance à la Cascade React.

6. RevealAnimation props et data attributes

Le nom cohérent avec Avatar est au singulier : `revealAnimationProps`.

```ts
revealAnimationProps?:
  | boolean
  | Omit<
      RevealAnimationProps,
      | 'children'
      | 'contentMode'
      | 'render'
      | 'reveal'
      | 'scale'
      | 'unrevealBehavior'
    >
```

LoadingCover doit garder la propriété de ces valeurs :

- `reveal`, piloté par `loading` et Cascade ;
- `unrevealBehavior="continue"` ;
- `render` et `children`, qui constituent sa surface ;
- `contentMode="flow"` ;
- `scale={1}`.

Le consommateur peut encore configurer direction, alignement, offsets et callbacks. Les callbacks observent le mouvement réel : le callback de sortie n’est déclenché qu’une fois les nested covers terminés.

Je retiendrais ces attributs publics sur Root :

- `data-loading` reflète la prop `loading` ;
- `data-loading-cover-state="hidden | revealing | revealed | unrevealing"` reflète l’état visuel réel ;
- `data-fullscreen` est présent en mode fullscreen ;
- les attributs `data-motion="reveal"` restent la propriété du RevealAnimation interne.

Il reste donc seulement trois confirmations : montage différé des enfants comme proposé, texte d’annonce par défaut, et possibilité de passer `revealAnimationProps={false}` pour désactiver l’animation.
