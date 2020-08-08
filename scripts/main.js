function lerp(a, b, t) {
    return a + ((b - a) * t);
}

function inverseLerp(a, b, val) {
    return clamp((val - a) / (b - a), 0.0, 1.0);
}

function clamp(val, min, max) {
    return Math.min(Math.max(min, val), max);
}

function randomInt(minInclusive, maxInclusive) {
    return Math.floor(lerp(minInclusive, maxInclusive + 1, Math.random()));
}

function animateCSS(element, animationName, callback) {
    const node = document.querySelector(element);
    node.classList.add('animated', animationName, 'fastest');

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName, 'fastest');
        node.removeEventListener('animationend', handleAnimationEnd);
        
        if(typeof callback === 'function')
            callback();
    }

    node.addEventListener('animationend', handleAnimationEnd);
}