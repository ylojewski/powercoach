Créer une animation Reveal.

Exemple d'usage cible :

```tsx
<RevealAnimation render={<Button />}>
  text
</RevealAnimation>
```

Surface :

- La surface est l'élément fourni dans la props render.
- La surface est l'élément qui déclenche l'animation au hover souris et au focus clavier.
- La surface peut être un composant DS comme `Button`, ou une autre boîte compatible.
- Reveal transmet le même contenu à la surface réelle et à la surface décorative d'overlay.
- Reveal ne doit pas copier les styles, tokens, markup ou internals de la surface. Il doit composer la surface fournie par son API publique.

Rendu réel et rendu overlay :

- Reveal rend deux instances de la surface fournie :
  - une surface réelle, visible, accessible et interactive ;
  - une surface overlay, purement décorative, utilisée pour obtenir une copie visuelle du contenu après passage dans l'anatomie publique de la surface.
- La surface réelle est la seule surface accessible et interactive.
- La surface overlay doit être inerte, non focusable et sans interaction pointeur.
- La surface overlay ne doit pas modifier le nom accessible, l'ordre de tabulation, les événements utilisateur, ni la sémantique de la surface réelle.
- La surface overlay doit reproduire le rendu du contenu après composition par la surface. En reprenant l'exemple d'utilisation ci-dessus, si Button transforme "text" en traitement de contenu interne, l'overlay doit aussi passer par Button afin de révéler le même traitement, sans que Reveal connaisse ou reconstruise les internals de Button.
- La surface overlay sert de gabarit de layout pour placer le contenu révélé au même endroit que le contenu réel.
- La surface overlay ne doit pas faire apparaître une deuxième surface interactive ou une deuxième sémantique. Toute partie décorative du rendu overlay qui n'est pas le contenu révélé doit rester cachée ou neutralisée visuellement, sauf la couche de reveal elle-même.

Contenu réel et contenu révélé :

- Le contenu passé à Reveal est le contenu réel de la surface.
- Reveal doit marquer le contenu réel et la copie de ce contenu dans l'overlay afin de pouvoir animer uniquement la copie révélée.
- Le contenu révélé est la copie du contenu après qu'il a été placé par le même layout que le contenu réel.
- Le contenu révélé doit hériter des styles produits par la surface fournie.
- Le contenu révélé est purement cosmétique.
- Seule la copie du contenu révélé est grossie d'un facteur de 20%.
- La géométrie de la surface, de l'overlay, du border box, du padding et du layout de la surface ne doit pas être grossie ni déformée.

Overlay :

- L'overlay recouvre toute la surface réelle, borders incluses, outline exclue.
- L'overlay passe au-dessus des borders de la surface réelle ; les borders de la surface réelle ne doivent donc plus être visibles dans la zone révélée.
- L'overlay ne doit pas masquer ou remplacer l'outline de focus, qui reste en dehors de la zone couverte par l'overlay.
- L'overlay utilise `clip-path` pour révéler sa surface.
- La direction par défaut est gauche vers droite.
- Je dois pouvoir choisir la direction parmi les quatre directions suivantes : gauche vers droite, droite vers gauche, haut vers bas, bas vers haut.
- L'animation de reveal utilise une durée de 300ms et une fonction `ease-out`.
- L'animation doit pouvoir être annulée ou inversée en cours de route sans saut visuel.
- Un changement de direction ne doit pas être animé afin d'éviter de voir l'overlay se déplacer visuellement dans l'UI.

Positionnement du contenu révélé :

- Je dois pouvoir repositionner uniquement le contenu révélé avec :
  - un décalage X ;
  - un décalage Y ;
  - un alignement X : "start", "center" par défaut, "end" ;
  - un alignement Y : "start", "center" par défaut, "end".
- Les alignements X/Y s'appliquent au rectangle du contenu révélé, pas au rectangle de la surface.
- La surface overlay couvre la boîte complète, mais elle ne sert pas de référence pour les alignements du contenu.
- Le contenu révélé est d'abord placé par le même layout que le contenu réel.
- Le contenu révélé est ensuite grossi de 20% autour de l'ancre définie par l'alignement X l'alignement Y.
- Le contenu révélé est ensuite déplacé par le décalage X et le décalage Y.
- Les décalages déplacent le contenu révélé après prise en compte du grossissement.
- Exemples d'alignement, tous relatifs au rectangle du texte ou contenu marqué :
  - alignement X "start" et alignement Y "start", sans décalage : après grossissement, les bords haut et gauche du contenu révélé restent sur les mêmes axes que les bords haut et gauche du contenu réel.
  - alignement X "center" et alignement Y "center", sans décalage : après grossissement, le centre du contenu révélé reste à l'exacte position du centre du contenu réel.
  - alignement X "end" et alignement X "end", sans décalage : après grossissement, les bords bas et droit du contenu révélé restent sur les mêmes axes que les bords bas et droit du contenu réel.
  - alignement X "start" et alignement X "center", avec décalage X de -20 et sans décalages Y : après grossissement, le bord gauche du contenu révélé est à 20px à gauche du  bord gauche du contenu réel, tandis que l'axe vertical central reste aligné.

Interaction :

- L'animation démarre quand la surface réelle reçoit un hover souris.
- L'animation démarre aussi quand la surface réelle reçoit un focus clavier.
- L'animation revient à son état de départ quand la surface n'est plus hover et n'a plus le focus clavier.
- Les autres événements ne doivent pas interférer avec l'animation.
- Le hover et le focus activent le même état reveal.
- Si le reveal est déjà actif, un second événement d'activation ne doit pas relancer l'animation depuis le début.
- Aucune altération de pointeur ne doit être ajoutée pour signifier l'interaction utilisateur.
- Si la surface fournie a déjà un cursor ou un traitement pointeur, il est conservé tel quel.

Contrôle externe :

- Je dois pouvoir contrôler l'état révélé depuis l'extérieur avec une prop reveal.
- Si la prop reveal est fournie, il a priorité sur les interactions hover/focus.
- Quand la prop reveal est fournie, les entrées et sorties de hover/focus ne doivent pas changer l'état de l'animation Reveal.
- Je dois pouvoir réagir aux changements d'état avec de la prop reveal (onRevealChange ?), y compris quand une animation est inversée en cours de route.
- Je dois pouvoir réagir au démarrage de l'animation Reveal (onRevealStart ?).
- Je dois pouvoir réagir à la fin complète de l'animation Reveal (onRevealComplete ?).

Modes dark/light :

- L'overlay et le contenu révélé doivent inverser les modes dark/light de sorte que les tokens de couleur y soient inversés.
- Si le mode dark n'est pas activé globalement, l'overlay et le contenu révélé doivent être rendus sous mode dark.
- Si le mode dark est activé globalement, l'overlay et le contenu révélé doivent être rendus sous mode light.
- En appliquant une classe `dark` ou `light` sur l'overlay, l'overlay et ses descendants doivent recevoir les tokens inversés comme défini par le thème actuellement en vigueur (même s'il est déprécié).

Accessibilité :

- Reveal est décorative.
- Elle ne doit pas perturber l'accessibilité de la surface réelle.
- La copie overlay ne doit pas créer de deuxième nom accessible, de deuxième rôle, de deuxième focus cible, ni de deuxième action.
- La copie overlay ne doit pas recevoir d'événements pointeur.

Motion réduite :

- En mode animation réduite, les changements d'état reveal doivent être immédiats, sans transition.

# Technical Note: RevealAnimation

## Core Principle

RevealAnimation should render the provided surface twice:

1. The real surface, interactive and accessible.
2. A decorative overlay surface, inert, used to obtain the exact same internal rendering.

Conceptually:

    <Button>
      <Heading>
        <span data-reveal-source>text</span>
      </Heading>
    </Button>

And in the overlay:

    <Button inert aria-hidden="true">
      <Heading>
        <span data-reveal-copy style={{ translate: 'var(--reveal-offset-x) var(--reveal-offset-y)' }}>
          <span data-reveal-copy-scale style={{ transformOrigin: 'var(--reveal-origin)' }}>
            text
          </span>
        </span>
      </Heading>
    </Button>

The important point: RevealAnimation does not know about Heading. It gets that rendering because it passes through the same Button surface again.

## Recommended Structure

    <span data-motion="reveal" data-reveal-root>
      <span data-reveal-surface>
        {cloneElement(render, realSurfaceProps, (
          <span data-reveal-source>{children}</span>
        ))}
      </span>

      <motion.span data-reveal-overlay>
        {cloneElement(render, overlaySurfaceProps, (
          <span data-reveal-copy>
            <span data-reveal-copy-scale>{children}</span>
          </span>
        ))}
      </motion.span>
    </span>

data-reveal-root establishes the stacking context.

data-reveal-surface contains the real surface.

data-reveal-overlay covers the full surface.

data-reveal-copy receives the offsets.

data-reveal-copy-scale receives scale: 1.2 and transform-origin.

## Critical Point

Do not scale the full overlay surface.

Avoid:

    <motion.span data-reveal-overlay style={{ scale: 1.2 }}>
      <Button>text</Button>
    </motion.span>

That would scale the box, borders, padding, and layout.

Do this instead:

    <Button inert aria-hidden="true">
      <span data-reveal-copy>
        <span data-reveal-copy-scale>text</span>
      </span>
    </Button>

The overlay surface keeps the same layout as the real surface. Only the copied content is moved and scaled.

## Positioning

alignX and alignY apply to the rectangle of data-reveal-copy-scale, not to the surface.

Recommended mapping:

    alignX start  -> transform-origin-x: left
    alignX center -> transform-origin-x: center
    alignX end    -> transform-origin-x: right

    alignY start  -> transform-origin-y: top
    alignY center -> transform-origin-y: center
    alignY end    -> transform-origin-y: bottom

Offsets should be applied on a separate parent:

    <span
      data-reveal-copy
      style={{
        translate: 'var(--reveal-offset-x) var(--reveal-offset-y)'
      }}
    >
      <span
        data-reveal-copy-scale
        style={{
          scale: 1.2,
          transformOrigin: 'left top'
        }}
      >
        {children}
      </span>
    </span>

This keeps offsetX={-20} as a true 20px shift, not 24px after scaling.

## Overlay

The overlay should cover the real surface border box, not only its content box.

Recommended shape:

    <span data-reveal-root className="relative inline-grid">
      <span data-reveal-surface className="col-start-1 row-start-1">
        {realSurface}
      </span>

      <motion.span
        data-reveal-overlay
        className="pointer-events-none absolute inset-0"
      >
        {overlaySurface}
      </motion.span>
    </span>

The focus outline stays excluded because it is painted outside the border box.

## Accessibility

The overlay surface must be neutralized:

    const overlaySurfaceProps = {
      'aria-hidden': true,
      inert: '',
      tabIndex: -1,
      'data-reveal-overlay-surface': ''
    }

It must also use pointer-events: none.

If the provided surface contains handlers, they should not produce effects from the overlay. Prefer not to re-emit consumer handlers on the decorative copy, or neutralize them in the overlay layer.

## Animation

The visible reveal should be applied to data-reveal-overlay through clip-path.

The revealed content itself should not own the clipping animation; it simply lives inside the clipped overlay.

motion/react should drive the animated state:

    <motion.span
      data-reveal-overlay
      animate={{ clipPath: revealedClipPath }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {overlaySurface}
    </motion.span>

In reduced motion, transition immediately.

## Events

Hover/focus listeners should be attached to the real surface or root wrapper, never to the overlay.

If reveal is externally controlled, hover/focus must not change the reveal state.

## Compatibility Limit

This model works if render accepts children and can be rendered twice. If a surface cannot be duplicated safely, it is not compatible with RevealAnimation; do not copy its internals as a workaround.