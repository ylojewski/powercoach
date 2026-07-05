# Design System - RailAccordion

Version 1 (nouveau composant)
Moteur d'animation : CSS transition.

## Description

Une sorte "d'Accordion horizontal" (au sens Base UI) et qui reste sémantiquement un Accordion (toujours au sens Base UI). Son utilisation consiste à révéler des RailAccordion.Panel en cliquant sur des RailAccordion.Trigger, utilisation qui peut être controllée ou incontrollée. Chaque RailAccordion.Item occupe 100% de l'espace vertical disponible — tout comme RailAccordion.Root qui lui-même occupe tout l'espace disponible (horizontal et vertical) du conteneur par défaut. RailAccordion.Trigger doit reprendre le traitement visuel public du Button du Design System en variante default avec revealAnimation. RailAccordion.Trigger possède toutefois le rôle, l'activation et la sémantique finale. Lors d'un clic sur un RailAccordion.Trigger, RailAccordion.Panel reprend le modèle d'animation Accordion.Panel pour le cycle open/closed et les data attributes pertinents, mais transpose l'axe animé de height vers width, révélant ainsi le contenu du RailAccordion.Panel correspondant. L'idée générale est donc de mimic l'animation Base UI Accordion mais de façon horizontale. Les RailAccordion.Panel se révèlent toujours de droite à gauche en LTR. L'orientation verticale ne doit pas être gérée. RTL est hors scope pour cette révision.

## RailAccordion.Panel

IMPORTANT : chaque RailAccordion.Panel doit être placé directement après le RailAccordion.Trigger associé, de telle sorte qu'on ait, dans le flux visuel, un premier RailAccordion.Trigger puis son RailAccordion.Panel, le second RailAccordion.Trigger puis son RailAccordion.Panel et ainsi de suite, à la manière d'Accordion.Panel, mais horizontal. Lorsqu'un RailAccordion.Panel est ouvert, il occupe TOUT l'espace disponible et "pousse" tous les onglets de part et d'autres. Lorsqu'un RailAccordion.Panel se rétracte, il "attire" tous les onglets vers lui. Si aucun RailAccordion.Panel n'est actif, tous les RailAccordion.Trigger sont stackés à droite de RailAccordion.List (d'où l'ouverture "droite vers gauche" d'un RailAccordion.Panel). RailAccordion.Trigger est bien entendu contenu dans un RailAccordion.Header, RailAccordion.Header et le RailAccordion.Panel associé sont dans un RailAccordion.Item

Même intention que l'animation Accordion.Panel, mais l'axe animé devient horizontal. Un RailAccordion.Panel ne révèle plus son contenu en gagnant de la hauteur ; il le révèle en gagnant de la largeur. La mesure de référence devient --railaccordion-panel-width (--railaccordion-panel-height n'est pas fourni). Le RailAccordion.Panel ouvert a une largeur égale à sa largeur de contenu mesurée (soit 100% de l'espace disponible une fois la largeur des RailAccordion.Header retirés) ; Largeur de 0 quand le panel est fermé.

À l'ouverture, le RailAccordion.Panel commence comme une surface sans largeur visible. Son bord d'ancrage reste fixe, et son bord opposé s'éloigne progressivement pour révéler le contenu latéralement. RailAccordion ne supporte que LTR dans cette révision ; avec un layout standard, cela se lit comme une révélation de droite à gauche. Le contenu ne fade pas, ne scale pas, ne glisse pas : il est simplement masqué puis découvert quand le width du RailAccordion.Panel parent s'anime vers sa largeur finale mesurée.

À la fermeture, le mouvement s'inverse : la largeur animée revient de la largeur mesurée à 0. Le contenu disparaît par clipping horizontal, depuis le bord opposé vers le bord d'ancrage. Les éléments voisins sont déplacés sur l'axe inline au rythme de la fermeture, pas sur l'axe vertical, sauf si le layout environnant force un retour à la ligne.

Point de contrat crucial : le contenu doit garder sa mise en page finale pendant que le masque se referme. Sinon, du texte peut se recomposer ligne par ligne à mesure que la largeur change, ce qui donne une animation nerveuse et instable. La largeur animée sert de masque horizontal sur un contenu à largeur stable, pas de contrainte responsive temporaire.

## RailAccordion.Indicator

Nouveauté par rapport à l'Accordion Base UI, RailAccordion dispose d'un indicateur RailAccordion.Indicator qui doit être positionné dans le repère de RailAccordion.Root.

Transitions : toutes les transitions se combinent, se déclenchent et se terminent en même temps. Il en existe 3 :
- width : 300ms ease-out ;
- left : 300ms ease-out ;
- opacity : 300ms linear.

Apparence : RailAccordion.Indicator est un rectangle de h-3 et de width correspondant au width du Header du RailAccordion.Trigger actif avec un fond foreground.

Position verticale : il doit être placé au-dessus de RailAccordion.Root, au contact, et donc, en dehors de la boite de RailAccordion.Root. Sa position verticale ne change jamais.

Animation d'entrée / sortie : RailAccordion.Indicator n'apparait que si un RailAccordion.Panel est ouvert. RailAccordion.Indicator apparait et disparait via un fade linéaire de 300ms.

Animation d'un RailAccordion.Trigger à l'autre : sa position cible est donnée par --active-railaccordion-left, et sa largeur cible par --active-railaccordion-width. Quand l'utilisateur active un autre RailAccordion.Trigger, RailAccordion.Indicator glisse horizontalement depuis son ancienne position jusqu'à la position finale du nouvel RailAccordion.Trigger actif (pas celle en cours d'animation du RailAccordion.Panel associé qui va forcément influencer la position du RailAccordion.Trigger cible), pendant que sa largeur s'ajuste pour épouser exactement la largeur du nouvel RailAccordion.Trigger actif (si les RailAccordion.Trigger n'ont pas la même width). Le mouvement et le redimensionnement doivent se produire ensemble, dans la même transition, pour donner l'impression d'une seule surface qui voyage.

L'animation d'entrée / sortie et l'animation d'un RailAccordion.Trigger à l'autre doivent se combiner. Au premier rendu, si aucun RailAccordion.Panel n'est ouvert, RailAccordion.Indicator a une position X de 0 (tout à gauche) mais n'est pas visible, si un RailAccordion.Panel est ouvert, RailAccordion.Indicator a la position X finale du RailAccordion.Trigger (les bords gauches coincident) et il apparait alors à cette position, qui devrait normalement être 0 (d'où le côté "convenient" de le mettre à 0 par défaut).

RailAccordion.Indicator doit rester aligné sur le Header du RailAccordion.Trigger actif. Son bord gauche doit coïncider avec le bord gauche mesuré du Header du RailAccordion.Trigger actif, et sa largeur avec la largeur mesurée du Header du RailAccordion.Trigger actif. Si les tabs ont des tailles différentes, la variation de largeur fait partie de l'animation : RailAccordion.Indicator peut s'étirer ou se contracter pendant son déplacement, mais il ne doit jamais finir avec une largeur générique ou approximative.

## RailAccordion.Trigger (et RailAccordion.Header)

Apparence : quasi identique à Button du Design System, sa hauteur remplie tout l'espace vertical disponible, sa largeur est fixée par défaut à w-10 (surchargeable via className). Son texte doit être aligné à gauche et avec une rotation de 90 degrés dont l'origine X est le bord gauche du texte et l'origine Y est le centre du texte. L'overlay RevealAnimation doit scrupuleusement respecter ce placement et cette transformation, et doit préciser un alignement équivalent : X en "start" et Y en "center".

Un RailAccordion.Trigger peut être disabled, dans ce cas il suit les mêmes spécifications définies pas l'Accordion de Base UI.

## Points clés
- Reprendre l'anatomie et l'accessibilité de Base UI Accordion ;
- RailAccordion n'est pas "multiple" : un seul RailAccordion.Trigger actif à la fois ;
- L'état sans valeur est autorisé au démarrage. Dans ce cas tous les RailAccordion.Panel sont "collapsed" et aucun RailAccordion.Trigger n'est actif. Une fois un RailAccordion.Trigger activé, il reste actif jusqu'à l'activation d'un autre RailAccordion.Trigger ; cliquer le RailAccordion.Trigger actif ne referme pas son RailAccordion.Panel. Si le composant est controllé, une valeur null revient à l'état initial = tous les RailAccordion.Panel sont "collapsed" ;
- Lorsqu'un RailAccordion.Trigger est actif, reveal: true doit être passé en props de revealAnimation pour figer l'interaction utilisateur ;
- Pour faciliter la visualisation dans tous les exemples, RailAccordion.Root doit être contenu dans un conteneur de w-100 h-100.

### Cas particulier, l'exemple "Links"
Fournir un exemple "Link" car le Manager aura besoin de ce composant pour sa navigation principale. RailAccordion.Trigger suit le pattern officiel Base UI Accordion pour l'exemple Links : nativeButton={false} et render avec un lien React Router (Link). RailAccordion.Trigger possède la sémantique finale du trigger Accordion. Cet usage n'implique pas que Button standalone devienne un composant de navigation. Il est donc possible d'écrire la chose suivante :

    <RailAccordion.Trigger
      nativeButton={false}
      render={<Link to="/programs" />}
      value="programs"
    >
      Programs
    </RailAccordion.Trigger>
