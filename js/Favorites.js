import { GithubUser } from "./GithubUser.js"

// classe que vai conter a lógica dos dados
//como os dados serão estruturados
class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    checkUserLength() {
        if (this.entries.length ===0) {
            document.querySelector(".empty-state").style.display = ""
        } else {
            document.querySelector(".empty-state").style.display = "none"
        }
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {
            const user = await GithubUser.search(username)

            if(user.login === undefined) {
                throw new Error('usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()

        } catch(error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
        this.checkUserLength()
    }
}


// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')
            this.add(value)
        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach( user => {
            const row = this.creatRow()
            
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.btn-remove').onclick = () => {
                const isOk = confirm(`Tem certeza que deseja remover ${user.login} da sua lista de favoritos?`)

                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
            this.checkUserLength()
        })
    }

    creatRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">
                <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
                <a href="https://github.com/maykbrito" target="_blank">
                    <p>Mayk Brito</p>
                    <span>maykbrito</span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="followers">
                9589
            </td>
            <td>
                <button class="btn-remove">Remove</button>
            </td>
        `

        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }

}