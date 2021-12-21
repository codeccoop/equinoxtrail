function killEvent (ev) {
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();
}

function getVisibleOffset (el) {
    var bounding = el.getBoundingClientRect();
    // innerHeight - bounding.bottom = space from the element's bottom to the bottom edge of the screen
    // bounding.top = space from bottom to the  the element's top to the top edge of the screen
    // bounding.top + (innerHeight - bounding.bottom) = innerHeight - bounding.height or space computed by the element
    // Math.max(0, innweWidth - (Math.max(0, innerWidth - bounding.right) + Math.max(0, bounding.left)));
    return {
        y: Math.max(0, innerHeight - (Math.max(0, innerHeight - bounding.bottom) + Math.max(0, bounding.top))),
        x: Math.max(0, innerWidth - (Math.max(0, innerWidth - bounding.right) + Math.max(0, bounding.left)))
    };
}