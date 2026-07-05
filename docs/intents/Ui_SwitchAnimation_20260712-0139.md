Créer une animation Swtich. Voici une discussion technique que j'ai eu. Utilise mes prompts / questions (Q:) et ses réponses (R:) comme base d'intent + conseils techniques :

--- Conversation ---

Q: Comment tu ferais une switch animation avec le moteur css de façon à ce que chaque children de switch animation puisse être rendu de façon conditionnel, ou un enfant a la fois peut être rendu, et a chaque fois qu’un enfant est remplacé par un autre au render via la condition, une animation se déclenche qui anime l’enfant qui ne doit plus être render et anime l’enfant qui doit être render, de façon légèrement staggered, via un combo translate + fade

R: OK, en faisant comme si le composant n’existait pas : je ne tenterais pas de faire ça avec “CSS seul”. Je ferais une primitive React de présence, avec moteur visuel CSS.
Le principe :
<SwitchAnimation orientation="vertical">
{state === 'empty' && <EmptyState key="empty" />}
{state === 'ready' && <ReadyState key="ready" />}
{state === 'error' && <ErrorState key="error" />}
</SwitchAnimation>
Contrat que je viserais :
un seul enfant actif à la fois ;
chaque enfant actif doit avoir une key stable ;
quand la key change, l’ancien enfant reste monté temporairement avec data-switch-state="exiting" ;
le nouvel enfant est monté avec data-switch-state="entering", puis passe à present après un frame ;
l’enfant sortant est retiré au transitionend ;
l’enfant sortant devient décoratif/inactif : aria-hidden, inert, pointer-events: none ;
le root expose data-motion="switch", data-orientation, et éventuellement des CSS variables publiques.
Le CSS porterait le moteur :
[data-motion='switch'] {
--switch-duration: 150ms;
--switch-stagger: 60ms;
--switch-offset: 10px;

display: inline-grid;
}

[data-switch-item] {
grid-area: 1 / 1;
opacity: 1;
transform: translate3d(0, 0, 0);
transition:
opacity var(--switch-duration) ease-out,
transform var(--switch-duration) ease-out;
}

[data-switch-state='entering'] {
opacity: 0;
transform: translateY(calc(var(--switch-offset) * -1));
}

[data-switch-state='present'] {
opacity: 1;
transform: translateY(0);
transition-delay: var(--switch-stagger);
}

[data-switch-state='exiting'] {
opacity: 0;
transform: translateY(var(--switch-offset));
transition-timing-function: ease-in;
}
Pour l’horizontal, je ne dupliquerais pas la logique React : seulement le calcul CSS change via data-orientation="horizontal".
Le point à décider côté produit/spec : que faire si zéro enfant est actif, si deux enfants sont actifs, et si les enfants ont des tailles différentes. Techniquement, le grid stack garde les deux enfants superposés pendant la transition, mais si les tailles divergent fortement il peut y avoir un snap de layout à la fin sans mesure JS.

Q: Ok, en terme de description de l’animation : chaque élément "present" doit être rendu dans le flux du container parent, a sa place naturelle, lors d’un leave, l’élément present doit slide down d’environ +15px + fade out depuis sa position, l’élément entering doit slide down depuis une position de -15px + fade in et doit prendre la place de l’élément qui était "present" dans le flux naturel. Comme tu fais ça sans qu’il y ait de saut lors du leave / enter, car malgré le staggered, a un moment y’aura les 2 éléments dans l’html

R: Je le ferais avec une règle simple : un seul élément participe au layout, les autres sont des couches visuelles temporaires.
Au moment du switch :
Le nouvel enfant devient immédiatement l’enfant “flow”.
Il est dans le flux naturel, à la place normale du contenu.

L’ancien enfant est rendu en “snapshot overlay”.
Il reste dans le DOM pour animer le leave, mais il passe en position: absolute, aria-hidden, inert, pointer-events: none. Donc il ne compte plus dans le layout.

Le container garde temporairement la taille de l’ancien contenu, puis anime sa taille vers celle du nouveau contenu.
Sans ça, si les contenus n’ont pas la même hauteur/largeur, le parent peut sauter.

Donc la structure mentale est :
<span data-motion="switch" style={measuredContainerVars}>
<span data-switch-flow>
<span data-switch-item data-switch-state="entering|present">
{nextChild}
</span>
</span>

{previousChild && (
<span data-switch-item data-switch-state="exiting" aria-hidden inert>
{previousChild}
</span>
)}
</span>
Le CSS anime uniquement opacity et transform :
[data-motion='switch'] {
position: relative;
display: inline-block;
overflow: clip;
inline-size: var(--switch-inline-size);
block-size: var(--switch-block-size);
transition:
inline-size 160ms ease-out,
block-size 160ms ease-out;
}

[data-switch-item] {
transition:
opacity 160ms ease-out,
transform 160ms ease-out;
}

[data-switch-state='entering'] {
opacity: 0;
transform: translateY(-15px);
}

[data-switch-state='present'] {
opacity: 1;
transform: translateY(0);
transition-delay: 50ms;
}

[data-switch-state='exiting'] {
position: absolute;
inset-block-start: 0;
inset-inline-start: 0;
opacity: 0;
transform: translateY(15px);
pointer-events: none;
}
Le détail important : pour que l’exit anime vraiment, l’élément sortant ne doit pas être monté directement en état final exiting. Il faut une phase préparatoire d’un frame : rendu en overlay à opacity: 1; transform: translateY(0), puis au requestAnimationFrame, passage à exiting.
Sans mesure JS, tu ne peux garantir “pas de saut” que si la spec impose des enfants de même taille ou une taille réservée stable. Avec des enfants de tailles inconnues, il faut mesurer l’ancien et le nouveau contenu, puis exposer ces mesures en variables CSS. Le moteur reste CSS ; React ne fait que gérer la présence, les phases, et les dimensions du slot.

Q: Dans ces conditions, Comment tu garantie que l’élément à la même position que quand il était dans le flux, car si tu lui colles juste un absolute, il va jump dans le coin haut gauche du premier parent relatif non ?

R: Oui, exactement : si tu fais juste position: absolute sans coordonnées, ça peut jump.
La garantie vient de cette séquence :
Pendant que l’ancien élément est encore dans le flux, tu mesures :
son getBoundingClientRect()
le getBoundingClientRect() du root SwitchAnimation

Tu calcules sa position locale :

const top = oldRect.top - rootRect.top
const left = oldRect.left - rootRect.left
Quand tu le passes en overlay, tu ne mets pas juste absolute; tu figes sa boîte :
[data-switch-state='leaving'] {
position: absolute;
top: var(--switch-leave-top);
left: var(--switch-leave-left);
width: var(--switch-leave-width);
height: var(--switch-leave-height);
}
Donc l’élément sortant commence son animation exactement à sa position visuelle précédente, puis seulement après tu appliques :
opacity: 0;
transform: translateY(15px);
C’est une logique FLIP partielle : tu captures la position “First” dans le flux, tu sors l’élément du layout, puis tu le rejoues visuellement depuis les mêmes coordonnées.
Dans le cas le plus propre, je mettrais aussi un wrapper interne contrôlé sans padding/border comme repère de positionnement. Comme ça les calculs oldRect - stageRect sont stables et ne dépendent pas du premier parent relatif externe.
Sans cette mesure, tu ne peux pas garantir l’absence de jump pour des enfants arbitraires. Tu peux seulement garantir ça si la spec impose une structure très contrainte, par exemple un root inline-grid où chaque enfant commence toujours en grid-area: 1 / 1.

Q: Ok donc ça veut dire que switch animation a un wrapper en relatif, ou alors on force le parent à être relatif ? Ou si y’a un wrapper, est ce que c’est compatible avec la prop render de base ui

R: Oui : SwitchAnimation doit posséder son propre repère relatif. Je ne forcerais pas le parent consommateur à être position: relative, parce que ça crée une précondition invisible et fragile.
La forme propre :
<SwitchAnimation>
{condition ? <A key="a" /> : <B key="b" />}
</SwitchAnimation>
Rendu conceptuel :
<span data-motion="switch" style={{ position: 'relative' }}>
<span data-switch-flow>
{currentChild}
</span>

{leavingChildOverlay}
</span>
Le root data-motion="switch" est le repère. L’élément sortant est positionné en absolu dans ce root, avec des coordonnées calculées depuis ce root :
top = leavingRect.top - rootRect.top
left = leavingRect.left - rootRect.left
Donc il ne saute pas vers un parent externe, parce qu’on ne dépend pas du premier parent relatif trouvé dans l’application.
Pour Base UI : oui, c’est compatible avec la prop render, mais seulement si on définit clairement ce que render contrôle.
Je ferais :
render contrôle le root de SwitchAnimation.
SwitchAnimation garde ses wrappers internes nécessaires au flow, à la mesure, et à l’overlay.
le root reçoit les props, le ref, data-motion, style, className, etc. via useRender + mergeProps.
Exemple d’API mentale :
<SwitchAnimation render={<span className="inline-flex" />}>
{active === 'a' ? <A key="a" /> : <B key="b" />}
</SwitchAnimation>
Et si un composant Base UI utilise SwitchAnimation dans son propre render, ça reste compatible à condition que SwitchAnimation forward/spread bien tout sur son root DOM :
<BasePart render={<SwitchAnimation />}>
{state ? <A key="a" /> : <B key="b" />}
</BasePart>
La limite : render ne doit pas supprimer le root mesurable ni déplacer les wrappers internes. Sinon on perd la garantie anti-jump. Donc la spec devrait dire que render remplace l’élément racine, pas l’anatomie interne.