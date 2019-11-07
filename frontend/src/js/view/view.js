
export class View {
    constructor(root = document.getElementById("application"), ...elements) {
        this.root = root;

        this.containers = new Array;

        for (const elem of elements) {
            const container = document.createElement("div");
            container.id = elem.constructor.name;

            this.containers.push({
                root: container,
                content: elem
            });
        }
    }

    
    create() {
        for (const container of this.containers) {
            this.root.append(container.root);
            console.log(`root: ${container.root.id}`);
            container.content.create(container.root);
        }
    }

    destroy() {
        for (const container of this.containers) {
            container.content.destroy();
        }

        this.root.innerHTML = "";
    }
}