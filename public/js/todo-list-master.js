import api from './api.js';

const templateHtml = `
<style>
    ul {
        list-style: none;
        padding: 0;
    }
    
    li {
        border-bottom: 1px solid #ccc;
        display: flex;
        align-items: center;
        gap: 5px;
        padding-top: 20px;
    }

    a {
        text-decoration: none;
        color: #000;
        cursor: pointer;
    }

    a:hover {
        text-decoration: underline;
    }

    svg {
        cursor: pointer;    
    }
</style>

<ul>    
</ul>
`;


export class TodoListMaster extends HTMLElement {
    lists;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadLists();
    }

    async loadLists() {
        this.lists = await api.getLists();
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = templateHtml;
        const ul = this.shadowRoot.querySelector('ul');

        for (const list of this.lists) {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="/list-detail.html?id=${list._id}">
                    ${list.name}
                </a>
                <svg width="16" height="16">
                    <path fill="red" stroke="red" stroke-width="2" d="M4,4 L12,12 M4,12 L12,4" />
                </svg>
            `;

            const button = li.querySelector('svg');
            button.addEventListener('click', async () => {
                if (confirm('Are you sure?')) {
                    await api.deleteList(list._id);
                    this.loadLists();    
                }
            });
            ul.appendChild(li);
        }
    }
}

customElements.define('todo-list-master', TodoListMaster);