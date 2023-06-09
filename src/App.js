import './css/App.css';
import './css/normalize.css';
import './css/DateActive.css';
//* Importando todos os componentes e hooks que iremos usar *//
import { useState, useEffect } from 'react'; //Hooks
import { bsTrash, BsBookmarkCheck, BsBookmarkCheckFill, BsTrash, BsBorder } from "react-icons/bs"; //Icones
import Modal from 'react-modal'; //Modal de react
import DateActive from './components/DateActive';

const API = 'http://localhost:5000'; //Isso aqui vem geralmente nos arquivos arquivos de configuração.. É basicamente o IP, a forma que vamos accessar a API.

function App() {
  const [title, setTitle] = useState(''); //Estado para o titulo
  const [time, setTime] = useState(''); //Horario e tempo da task
  const [todos, setTodos] = useState([]); // Estado para a lista/tarefas. Começa com uma lista vazia para poder ser inserido dados
  const [loading, setLoading] = useState(false); // Loading, uma forma de carregar os dados e exibir para o usuario que os dados estão sendo carregados. Antes do usuario ver a tela em branco e derrepente os dados surgirem
  const [date, setDate] = useState('');
  const [describe, setDescribe] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredTodos, setFilteredTodos] = useState([]);

  // Load todos on page load
  useEffect(() => { //Função anonima com segundo argumento um array dependencias que quando está vazil ele é executado quando a pagina carrega


    const loadData =  async (e) => {
      setLoading(true);
      //Esta função tem como premissa, utilizar o fetchapi e trazer o dado que eu quero.

      const res = await fetch(API + '/todos')
        .then((res) => res.json())
        .then((data) => data) //Essa variavel guarda os dados do fetch. Então eu inicio o load e começo a carregar dados de forma assincrona da API. o Await aqui funciona porque a função é assincrona.
        //Não preciso configurar a requisição porque o padrão já é um get. Mas concatenei alguns metodos, pois é premissebase. o then pega os dados e os retorna em uma array de objetos
        .catch((err) => console.log(err)); //Ele pode me dar um erro,dando um console log possibilitando ser resolvido posteriormente
      
      setLoading(false) //Definimos um setloading false dnv pq ele já terminou de carregar. Pois a função await segura o codigo ate carregar tudo, depois ele tira tudo,
      
      setTodos(res); //res são os dados que são transformados de texto json para uma array de objetos.

    };

    loadData(); /*Carrega a pagina e executa o loadData que espera os dados irem pro backEnd */

  }, [])

  const handleSubmit = async (e) => { //Deixamos como uma função assincrona pois teremos que esperar a resposta do fatch, é uma requisição assincrona.
     e.preventDefault()

     
    const todo = {
      id: Math.random(), 
      title,
      date,
      time,
      describe,
      done: false,
    };
    /* ID: Cria um ID para o objeto, que podemos utilziar no front end. */
    /*DONE: A tarefa entra naturalmente como falsa/não completa no sistema. Propiedade que define se ela esta ou não completa.*/    

    //COMUNICAÇÃO COM A API: (PADRÃO JSON DE SE COMUNICAR)
    await fetch(API + "/todos", {
      //segurando parametro parametro que é um objeto configurando a requisição
      method: "POST",  //Metodo de inserção de dados na API
      body: JSON.stringify(todo), //body é aonde vão os dados, Metodo stringfy envia o nosso objeto como string, para se comunicar com o backend e la ele converte em um objeto (pois ele não entenderia um objeto JS puro)
      headers: { //Definindo padrão de comunicação
        "Content-Type": "application/json",
      },
    })

    

    //INSERIR OS DADOS NA LISTA DE FORMA AUTOMATICA SEM TER QUE DAR F5
    setTodos((prevState) => [...prevState, todo]); //PrevState é o estado anterior do item que estamos trabalhando. Então consigo adicionar um item ao estado anterior e gerar um novo estado.
    /*Basicamente estamos utilizando o spread operador para pegar todos os todos  que eu tinha, e colocar o novo todo nessa lista de todo.
    */


    //Zerando os inputs
    setTitle("");
    setTime("");
    setDate("");
    setDescribe("");

  }; {/*O E como parametro acima é o evento em si, serve para parar o formulário quando ele for enviado, a pagina não recarrega
  caso o formulário seja enviado. Pois recarregar toda vez quebra o fluxo do SPA */} 


  const handleDelete = async (id) => {
    await fetch(API + "/todos/" + id, {
      method: "DELETE", 
    });

    {/*Para previnir o erro da segunda leitura, e atualizar a informação também no front-end, precisamos utilizar a operação abaixo. */}
    setTodos((prevState) => prevState.filter((todo) => todo.id !==id));
    {/*Estamos filtrando  os todos, estamos comparando o id com o id que vieo por requisição e retornando o todo caso de true. */}
  };

  const handleEdit = async(todo) => {

    todo.done =  !todo.done; {/*Descompletando caso eu tenha completado a tarefa sem querer */}


    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT", 
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      }, 
    });

    setTodos((prevState) => 
      prevState.map((t) => (t.id === data.id ? (t = data) : t))
    );
  };

  //Não dar conflito na hora de exibir os conteudos e a mensagem que não ha conteudos. Previni exibir mensagem errada ao usuario
  if(loading){ //Checar se esta carregando
    return <p>Aguarde um momento...</p>

  };

  const filterTodosByMonth = (month) => {
    const filteredTodos = todos.filter(
      (todo) => new Date(todo.date).getMonth() === month - 1
    );
    return filteredTodos;
  };

  const handleOpenModal = () => {
    const month = new Date().getMonth() + 1;
    const filteredTodos = filterTodosByMonth(month);
    setFilteredTodos(filteredTodos);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  

  return (
    <div className="App">
      
      <div className='todo-header'>
        <h1>ReList</h1>
      </div>
      
      <div className='forms-todo'>
        
        <h2>Insira sua próxima tarefa: </h2>
        
        <form onSubmit={handleSubmit}>
          
          <div className='forms-control'>
            
            <label htmlFor='title'>O que você vai realizar?</label>
            
            <input type="text" name='title' placeholder='Título da tarefa' onChange={(e) => setTitle(e.target.value)} value={title || ""} required ></input> 
            {/*O evento onChange aqui neste caso, captura cada mudança do state setTitle
            a cada tecla que o user precionar. O "E" é o evento, o target é o meu input; estamos colocando no title o valor 
            deste input. Basicamente esssa função recupera o valor de title enquanto limpa o campo de input.*/}
            {/*VALUE: estamos colocando o valor igual ao state do input; com isso criamos uma tecnica chamada control input, com isso
            eu consigo setar o valor deste input no meio do set title ou em algum lugar, modificando o texto que ele está escrito. Isso vai
            servir para limpar o input depois por exemplo. 
            || "" serve para que o valor do input não seja alterado na hora que ta carregando a pagina, isso porque state é assincrono.
            então quando colocamos esses caracteres, estamos dizendo que ele pode começar com um valor vazil e depois que houver o valor do title
            ele irá trocar*/}
          </div>

          <div className='forms-control'>
          
            <label htmlFor='describe'>Descreva sua tarefa: </label>
            
            <input 
              type='text'
              name='describe'
              className='describe' 
              placeholder='Descrição da tarefa...'  
              onChange={(e) => setDescribe(e.target.value)} 
              value={describe || ""}
              required
              />
          
          </div>

          <div className='forms-control'>
           
            <label htmlFor='time'>Finalizar até: </label>
           
            <input 
              type='time' 
              name='time' 
              placeholder='Tempo em horas (3h)' 
              onChange={(e) => setTime(e.target.value)} 
              value={time || ""}
              required
              />

            <input 
              type='date' 
              name='date' 
              placeholder='Data de entrega:' 
              onChange={(e) => setDate(e.target.value)} 
              value={date || ""}
              required
              />
               
          </div>

          <input className='buttonMd1' type="submit" value="Criar Tarefa" />

        </form>

        <input className='buttonMd2' type="submit" value="Tarefas do Mês Atual" onClick={handleOpenModal} />
        <DateActive 
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          filteredTodos={filteredTodos}
        />

      </div> 

      <div className='list-todo'>
        <h2> Lista de tarefas: </h2>
        {todos.length === 0 && <p>Não há tarefas</p>} {/**Renderização condicional **/}
        {todos.map((todo) => (
          
          <div className='todo' key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <h6 className={todo.done ? "todo-done" : ""}>Deve ser finalizada até: </h6>
            <p>{todo.date}</p>
            <p>{todo.time}</p>
            

            <h6 className={todo.done ? "todo-done" : ""}>Descrição: </h6>
            <p className='pDesc'>{todo.describe}</p>
            
            <div className='actions'>
              <span onClick={() => handleEdit(todo)}> {/*Aqui em vez do id precisamos mandar a tarefa toda */}
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}  {/*Checa se a tarefa já está pronta e exibe um icone.*/}
              </span>
              <BsTrash className='teste' onClick={() => handleDelete(todo.id)} /> {/*Utilizamos aqui uma arrowFunction pois ai temos a possibilidade de executar uma função
              com argumento.  Se colocassemos sem a arrowFunction o react iria executar o argumento assim que renderizar, mas colocando
              com arrowFunction ela  espera o evento ocorrer..*/}
            </div>
          
          </div>
        ))} {/*Preenchendo a lista de tarefas com o TODO */}   

      </div>

    </div>
  );
}

export default App;
