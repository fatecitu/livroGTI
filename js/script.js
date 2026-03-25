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
        preview.innerHTML = `<div class='book-card'>
        <img src='${data[isbnNumber].cover.medium}'>
            <div>
               <h3>${data[isbnNumber].title}</h3>
               <p>Nr Páginas: ${data[isbnNumber].number_of_pages}</p>
            </div>
        </div>
        `
    } catch(error) {
        alert('Erro na busca:', error)
    }
}