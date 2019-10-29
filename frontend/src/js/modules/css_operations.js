// delete classOne, add classTwo
export const replaceTwoCssClasses = (elem, classOne, classTwo) => {
    if (elem.classList.contains(classOne)) {
        elem.classList.remove(classOne);
    }
    if (!elem.classList.contains(classTwo)) {
        elem.classList.add(classTwo);
    }
};