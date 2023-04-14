import React, { useState } from 'react';
// Importa a modal do react-modal
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import '../css/DateActive.css';

// Código necessário para os recursos de acessibilidade
Modal.setAppElement('#root');

function DateActive({ isOpen, onRequestClose, filteredTodos, setTodos }) {

  const monthNow = () => {
    const month = new Date().getMonth() + 1;
    const monthN = month;

    switch(monthN) {
        case 1:
            return 'Janeiro'
            break;
        case 2: 
            return 'Fevereiro'
            break;
        case 3:
            return 'Março'
            break;
        case 4: 
            return 'Abril'
            break;
        case 5:
            return 'Maio'
            break;
        case 6:
            return 'Junho'
            break;
        case 7:
            return 'Julho'
            break;
        case 8:
            return 'Agosto'
            break;
        case 9:
            return 'Setembro'
            break;
        case 10:
            return 'Outubro'
            break;
        case 11:
            return 'Novembro'
            break;
        case 12:
            return 'Dezembro'
            break;

        default:
            return 'Não foi possivel reconhecer o mês atual, por favor recarregue a pagina e tente novamente :/'
            break;
    };
  }

  const handleFilter = (filterStatus) => {

    if (filterStatus === 'concluida') {
      setTodos(filteredTodos.filter(todo => todo.done));

    } else if (filterStatus === 'todas') {
      setTodos(filteredTodos.filter(todo => !todo.done));
    }
  }

  console.log(setTodos)

  // Código JSX necessário para criar uma modal simples que abre e fecha
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel=""
        className="modal"
        overlayClassName="modal-overlay"
        closeTimeoutMS={200}
      >

        
        <div className='list-todo'>
          <div className='listTitle'>
            <h2>Olá, essas são suas tarefas de {monthNow()} </h2>
          </div>

          <div>
            <button onClick={() => handleFilter('concluidas')}>Concluidas</button>
            <button onClick={() => handleFilter('todas')}>Todas</button>
            
          </div>
    
          <div className='overflow'>
            {filteredTodos.map((todo) => (
              <div className='todo' key={todo.id}>
                <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
                <h6 className={todo.done ? "todo-done" : ""}>Deve ser finalizada até: </h6>
                <p>{todo.date}</p>
                <p>{todo.time}</p>
                <h6 className={todo.done ? "todo-done" : ""}>Descrição: </h6>
                <p className='pDesc'>{todo.describe}</p>
              </div>
            ))}
          </div>
        </div>

      </Modal>
    </div>
  );
};

DateActive.propTypes = { //Definimos o tipo da propiedade/parametro que nosso componente está recebendo
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  filteredTodos: PropTypes.array.isRequired,
};
export default DateActive;