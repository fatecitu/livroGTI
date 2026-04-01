async function buscarLivro(){
    const isbn = document.getElementById('isbn').value
    const preview = document.getElementById('preview-container')
    //Validação básica
    if(!isbn){
        Swal.fire({
            title: 'ISBN é obrigatório',
            text: 'Por favor, informe um ISBN para consulta',
            icon: 'warning', //error, success, info
            confirmButtonText: 'OK'
        })
        return
    }
    //buscando dados na API
    try{
        const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`)
        const data = await response.json()
        console.log(data)//mostra na console
        //verificando se o ISBN existe nos dados
        const isbnNumber = `ISBN:${isbn}`
        if(!data[isbnNumber]){
            Swal.fire({icon: 'error', title: 'ISBN inválido', text: 'O número do ISBN não foi encontrado'})
            return
        }
        //mostrando os dados obtidos
        
        const titulo = data[isbnNumber].title
        const capa = data[isbnNumber].cover.medium
        const paginas = data[isbnNumber].number_of_pages    
       
        preview.innerHTML = `<div class='book-card'>
        <img src='${data[isbnNumber].cover.medium}'>
            <div>
               <h3>${data[isbnNumber].title}</h3>
               <p>Nr Páginas: ${data[isbnNumber].number_of_pages}</p>
                <button onclick="salvarLivro('${titulo}','${capa}','${paginas}','${isbn}')">Adicionar à estante</button>        
            </div>
        </div>
        `
    } catch(error) {
        alert('Erro na busca:', error)
    }
}

function salvarLivro(titulo, capa, paginas, isbn){
    const estante = JSON.parse(localStorage.getItem('estante')) || []
    //validação do ISBN
    if(estante.find(livro => livro.isbn === isbn)){
        Swal.fire({
            title: 'ISBN já está favoritado',
            text: 'O ISBN informado já está salvo na sua base',
            icon: 'info'
        })
        return //paramos o processamento
    }

    //pegamos o array e adicionamos no fim o novo registro
    estante.push({titulo, capa, paginas, isbn})
    //salvamos no localStorage
    localStorage.setItem('estante', JSON.stringify(estante))
    Swal.fire({
            title: 'Tudo ok!',
            text: 'Livro salvo com sucesso!',
            icon: 'success', //error, success, info
            showConfirmButton: false,
            timer: 1500 //tempo em ms
        })
    carregaDados()
    document.getElementById('isbn').value = '' //limpa o campo
    document.getElementById('preview-container').innerHTML = '' //limpa o preview   
}

function carregaDados(){
    const tabelaBody = document.getElementById('table-body')
    //carrega os dados do LocalStorage
    const estante = JSON.parse(localStorage.getItem('estante')) || []
    //vamos percorrer cada elemento do array
    estante.forEach(livro => {
        const tr = document.createElement('tr')
        tr.innerHTML = ` <td><img src='${livro.capa}' width='40'/></td>
          <td>${livro.titulo}</td>
          <td>${livro.isbn}</td>
          <td>${livro.paginas}</td>
        `
        tabelaBody.appendChild(tr) //adiciona o tr na tabela
    })
}
//carrega ao iniciar
carregaDados()