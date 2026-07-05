# BottomSheet — Q&A

## Q1 - Q&A avec ds-dev en mode pm-advice

Que préconise tu comme nouveau composant avec ces caractéristiques :
- Wrapper de drawer
- Utilise la capacité intent de drawer out-of-the-box
- swipe motion down
- s'ouvre en bas sur toute la largeur exactement comme dans l'exemple indent de base-ui
- s'ouvre quasiment tout en haut de la surface dispo sans snap points
Quel nom ? Quelle anatomie ? Quelles props ?

## A1

Je recommande **`BottomSheet`**.

`Drawer` serait trop générique puisqu’on ne supporte ni les côtés ni les snap points. `BottomDrawer` fonctionnerait, mais `BottomSheet` décrit mieux le pattern produit : panneau inférieur, pleine largeur, presque plein écran, dismissible par swipe.

### Anatomie recommandée

```tsx
<BottomSheet.Surface>
  <AppContent>
    <BottomSheet.Root>
      <BottomSheet.Trigger render={<Button />}>
        Ouvrir
      </BottomSheet.Trigger>

      <BottomSheet.Portal>
        <BottomSheet.Backdrop />
        <BottomSheet.Viewport>
          <BottomSheet.Popup>
            <BottomSheet.Content>
              <BottomSheet.Title>...</BottomSheet.Title>
              <BottomSheet.Description>...</BottomSheet.Description>

              {content}

              <BottomSheet.Close render={<Button />}>
                Fermer
              </BottomSheet.Close>
            </BottomSheet.Content>
          </BottomSheet.Popup>
        </BottomSheet.Viewport>
      </BottomSheet.Portal>
    </BottomSheet.Root>
  </AppContent>
</BottomSheet.Surface>
```

`BottomSheet.Surface` serait la vraie valeur ajoutée Powercoach :

- délimite la surface disponible ;
- installe la coordination Base UI `Provider` ;
- applique automatiquement `IndentBackground` et `Indent` ;
- fournit le conteneur du portail ;
- permet à plusieurs `BottomSheet.Root` descendants de partager le même effet d’indentation.

Je ne rendrais donc pas `Provider`, `Indent` et `IndentBackground` publics séparément. Ce sont des détails nécessaires au mécanisme, mais `Surface` garantit l’effet out-of-the-box.

### Props

| Partie                  | Props recommandées                                                                                   |
|-------------------------|------------------------------------------------------------------------------------------------------|
| `Surface`               | `children`, `className`, `style`, `render`                                                           |
| `Root`                  | `open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`, `disablePointerDismissal`, `children` |
| `Trigger`               | API Base UI Trigger complète, notamment `render`, `nativeButton`, `disabled`                         |
| `Portal`                | `keepMounted`, mais pas `container` puisque `Surface` le possède                                     |
| `Backdrop`              | `className`, `style`, `render`                                                                       |
| `Viewport`              | `className`, `style`, `render`                                                                       |
| `Popup`                 | `initialFocus`, `finalFocus`, `className`, `style`, `render`                                         |
| `Content`               | `children`, `className`, `style`, `render`                                                           |
| `Title` / `Description` | API Base UI correspondante, avec leurs éléments sémantiques                                          |
| `Close`                 | API Base UI Close complète, notamment `render` et `nativeButton`                                     |

`onOpenChange` doit conserver la signature Base UI complète, avec `eventDetails`. Le consommateur peut ainsi distinguer fermeture par swipe, backdrop, Échap ou bouton.

### Invariants à verrouiller

Je ne rendrais pas publiques les props suivantes :

- `swipeDirection` : toujours `down` ;
- `snapPoints`, `snapPoint`, `defaultSnapPoint`, `onSnapPointChange`, `snapToSequentialPoints` : absentes ;
- `modal` : fixé à `true` ;
- `placement`, `side`, `size` ou `height` : aucune variante en v1.

Le comportement serait fixe :

- largeur `100%` de `Surface` ;
- hauteur `calc(100% - 1rem)` environ, donc un espace supérieur stable ;
- contenu interne scrollable ;
- safe area inférieure respectée ;
- fermeture par swipe vers le bas, backdrop, Échap ou `Close` ;
- focus piégé et scroll de la surface bloqué pendant l’ouverture.

### Deux nuances importantes

L’exemple Indent de Base UI utilise des coins arrondis et `modal={false}`. Je reprendrais le mouvement d’indentation, mais :

- sans arrondi, car Powercoach impose une géométrie carrée ;
- en modal par défaut, car le choix non modal de la démo ne doit pas devenir implicitement notre comportement d’accessibilité.

Enfin, je préconise explicitement le moteur **CSS** : c’est celui du modèle Base UI, il exploite directement les variables de swipe et permet une inversion fluide en cours de transition. J’interprète donc « swipe motion down » comme le geste, pas comme une demande d’utiliser la bibliothèque Motion.

## Autres points

- Pas de bouton de fermeture par défaut, le consommateur en mettra un s'il en a besoin
- Le handle doit être visuellement comme dans l'exemple Base-UI, sans arrondis, mais en token couleur background pour plus de contraste
- Le nesting de drawers est strictement identique à l'exemple nested drawers de base-ui. Seule différence : l'ombre à appliquer sur les drawers nested doit être celle de field-emphasis
- A la différence de Base UI, le border top doit être en token couleur "border"
