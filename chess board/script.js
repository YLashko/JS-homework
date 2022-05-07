function insert_figure(element){
    if (element.firstChild == null){
        let image = document.createElement("img");
        image.src = "piece.png";
        image.className = "image";
        element.appendChild(image);
    } else {
        element.removeChild(element.firstChild);
    }
}