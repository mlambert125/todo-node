import api from './api.js';

const templateHtml = `
<style>
    div {
        background-color: rgba(0, 200, 0, 0.2);;
        border: 1px solid #ccc;
        border-radius: 3px;
        padding: 10px;
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;

        & label {
            flex-grow: 1;
            display: flex;
            align-items: center;
            gap: 20px;
            
            & span {
            }

            & input {
                flex-grow: 1;
                width: 100%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                background-color: white;
                outline: 0;
            }
        }

        & button {
            min-width: 125px;
            padding: 10px;
            border: 0;
            border-radius: 5px;
            background-color: rgba(0, 150, 0, 0.7);
            color: white;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0px 0px 10px #777;
            outline: 0;
        }
    }
</style>

<div>
    <label>
        <span>Name</span>
        <input type="text" />    
    </label>
    <button>Create</button>
</div>
`;

export class TodoListCreateForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = templateHtml;
        const btnCreate = this.shadowRoot.querySelector('button');
        btnCreate.addEventListener('click', async () => {
            const listName = this.shadowRoot.querySelector('input').value;

            if (listName.length > 0) {
                await api.createList(listName);
                this.dispatchEvent(new CustomEvent('list-created'));
            }
            this.shadowRoot.querySelector('input').value = '';
        });
    }
}

customElements.define('todo-list-create-form', TodoListCreateForm);
