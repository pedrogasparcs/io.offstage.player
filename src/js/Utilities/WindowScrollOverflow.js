/**
 * Created by PedroGaspar on 04/10/2016.
 */

const validateWindowScroll = (domElement, bottomThreshold, onOverflow) => {
    const bodyTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop; // because of IE // older version: $("body").scrollTop ()
    const galleryHeight = domElement.clientHeight || domElement.offsetHeight;
    const galleryOffsetTop = domElement.offsetTop;
    if (galleryOffsetTop + galleryHeight - bottomThreshold - bodyTop <= window.innerHeight) {
        onOverflow ();
    }
}

const WindowScrollOverflow = (domElement, bottomThreshold, onOverflow) => {
    window.addEventListener ("scroll", (e) => validateWindowScroll(domElement, bottomThreshold, onOverflow));
}

export default WindowScrollOverflow;