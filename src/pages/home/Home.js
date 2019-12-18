import React, { Component } from 'react';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import { 
    Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupAddon, 
    InputGroupText, Input, FormGroup
} from 'reactstrap';
import moment from 'moment';
import { fetchTodos, addTodo, deleteTodo } from '../../redux/actions/todos';
import { connect } from 'react-redux';

class Home extends Component {
    constructor(){
        super();

        this.columns = [
            {
                Header: '',
                Cell: (row, index) => (
                    <Button onClick={() => this.toggleSureModalDeleteTodo(row.original.id)}>Sil</Button>
                ),
                width: 60,
                filterable: false
            },
            {
                Header: 'Başlık',
                accessor: 'title'
            },
            {
                Header: 'Tanım',
                accessor: 'description',
            },
            {
                Header: 'Önem Değeri (1, 10)',
                accessor: 'importantValue'
            },
            {
                Header: 'Ne Zamana Kadar?',
                accessor: item => item.date ? moment(item.date).format('DD/MM/YYYY') : '',
                id: 'date'
            }

        ]

        this.state = {
            addTodo: {
                inputModalVisual: false,
                sureModalVisual: false,
                isSuccess: false,
                isFailed: false,
                isRequesting: false,
                data: {
                    title: '',
                    description: '',
                    importantValue: '1',
                    date: moment(new Date().getTime()).format('YYYY-MM-DD')
                }
            },
            deleteTodo: {
                sureModalVisual: false,
                isSuccess: false,
                isFailed: false,
                isRequesting: false,
                todoId: null
            }
        }
    }

    componentDidMount(){
        this.props.getTodos();
    }

    componentDidUpdate(){
        if (this.state.addTodo.isRequesting && !this.props.todo.isLoading) {
            if (this.props.todo.error) {
                this.setState(prevState => ({
                    addTodo: { ...prevState.addTodo,
                        inputModalVisual: false,
                        sureModalVisual: false,
                        isSuccess: false,
                        isRequesting: false,
                        isFailed: true
                    }
                }));
            } 
            else {
                this.setState(prevState => ({
                    addTodo: { ...prevState.addTodo,
                        inputModalVisual: false,
                        sureModalVisual: false,
                        isSuccess: true,
                        isRequesting: false,
                        isFailed: false
                    }
                }));
            }
        }
        else if (this.state.deleteTodo.isRequesting && !this.props.todo.isLoading) {
            if (this.props.todo.error) {
                this.setState(prevState => ({
                    deleteTodo: { ...prevState.deleteTodo,
                        sureModalVisual: false,
                        isSuccess: false,
                        isRequesting: false,
                        isFailed: true
                    }
                }));
            } 
            else {
                this.setState(prevState => ({
                    deleteTodo: { ...prevState.deleteTodo,
                        sureModalVisual: false,
                        isSuccess: true,
                        isRequesting: false,
                        isFailed: false
                    }
                }));
            }
        }
    }

    handleChange = (event) => {
        const value = event.target.value;
        const aim = (event.target.name).split(".");

        this.setState(prevState => ({
            [aim[0]]: { ...prevState[aim[0]],
                data: { ...prevState[aim[0]].data,
                    [aim[1]]: value
                }
            }
        }));
    };

    handleDateChange = (event) => {
        const value = event.target.value;
        const aim = (event.target.name).split(".");

        const convertToDoubleFromDate = (dateString) => {
            const date = new Date(dateString);
            return date.getTime();
        }

        this.setState(prevState => ({
            [aim[0]]: { ...prevState[aim[0]],
                data: { ...prevState[aim[0]].data,
                    [aim[1]]: convertToDoubleFromDate(value)
                }
            }
        }));
    }

    toggleInputModalAddTodo = () => {
        this.setState(prevState => ({
            addTodo: { ...prevState.addTodo, inputModalVisual: !this.state.addTodo.inputModalVisual }
        }));
    }
    toggleSureModalAddTodo = () => {
        this.setState(prevState => ({
            addTodo: { ...prevState.addTodo, 
                inputModalVisual: !this.state.addTodo.inputModalVisual,
                sureModalVisual: !this.state.addTodo.sureModalVisual 
            }
        }));
    }
    addTodoPress = (todo) => {
        this.props.todoAdd(todo);

        this.setState(prevState => ({
            addTodo: { ...prevState.addTodo,
                inputModalVisual: false,
                isRequesting: true,
                data: {
                    title: '',
                    description: '',
                    importantValue: '1',
                    date: moment(new Date().getTime()).format('YYYY-MM-DD')
                }
            }
        }));
    }

    toggleSureModalDeleteTodo = (todoId) => {
        this.setState(prevState => ({
            deleteTodo: { ...prevState.deleteTodo,
                sureModalVisual: !prevState.deleteTodo.sureModalVisual,
                todoId: todoId
            }
        }));
    }
    deleteTodoPress = (todoId) => {
        this.props.todoDelete(todoId);

        this.setState(prevState => ({
            deleteTodo: { ...prevState.deleteTodo,
                isRequesting: true,
                todoId: null
            }
        }));
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.addTodo.inputModalVisual} toggle={this.toggleInputModalAddTodo}
                    className={'modal-warning ' + this.props.className}>
                    
                    <ModalHeader toggle={this.toggleInputAddModalTodo}>Ekle</ModalHeader>
                    
                    <ModalBody>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText></InputGroupText>
                            </InputGroupAddon>
                            <Input
                                name="addTodo.title" 
                                placeholder="Başlık"
                                onChange={this.handleChange}
                                value={this.state.addTodo.data.title} 
                            />
                        </InputGroup>
                        <br/>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText></InputGroupText>
                            </InputGroupAddon>
                            <Input
                                name="addTodo.description" 
                                placeholder="Açıklama"
                                onChange={this.handleChange}
                                value={this.state.addTodo.data.description} 
                            />
                        </InputGroup>
                        <br />
                        <FormGroup>
                            <Input type="select" name="addTodo.importantValue" onChange={this.handleChange}>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                            </Input>
                        </FormGroup>
                        <InputGroup>
                            <Input
                                name="addTodo.date"
                                type="date"
                                onChange={this.handleDateChange}
                                value={moment(this.state.addTodo.data.date).format('YYYY-MM-DD')}
                                />
                        </InputGroup>
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="warning"
                            onClick={() => this.toggleSureModalAddTodo()}>Ekle</Button>{' '}
                        <Button color="secondary" onClick={this.toggleInputModalAddTodo}>Vazgeç</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.addTodo.sureModalVisual} toggle={this.toggleSureModalAddTodo}
                    className={'modal-warning ' + this.props.className}>

                    <ModalHeader toggle={this.toggleSureModalAddTodo}>Ekle</ModalHeader>
                    
                    <ModalBody>
                        Görevi eklemek istediğinize emin misiniz?
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="warning"
                            onClick={() => this.addTodoPress(this.state.addTodo.data)}>Evet</Button>{' '}
                        <Button color="secondary" onClick={this.toggleSureModalAddTodo}>Geri Dön</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.addTodo.isRequesting}
                    className={'modal-info ' + this.props.className}>
                    
                    <ModalHeader>Bilgilendirme</ModalHeader>
                    
                    <ModalBody>
                        İşleminiz gerçekleştiriliyor. Lütfen bekleyiniz...
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.addTodo.isSuccess}
                    className={'modal-success ' + this.props.className}>
                    
                    <ModalHeader>İşleminiz Başarılı</ModalHeader>
                    
                    <ModalBody>
                        Görev başarılı bir şekilde eklenmiştir.
                    </ModalBody>

                    <ModalFooter>
                        <Button 
                            color="success"
                            onClick={() => this.setState(prevState => ({ addTodo: {...prevState.addTodo, isSuccess: false } }))}>
                                Tamam
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.addTodo.isFailed}
                    className={'modal-danger ' + this.props.className}>
                    
                    <ModalHeader>İşleminiz Hatalı</ModalHeader>
                    
                    <ModalBody>
                        Görev eklenirken bir hata meydana geldi lütfen tekrar deneyiniz.
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="danger"
                            onClick={() => this.setState(prevState => ({ addTodo: { ...prevState.addTodo, isFailed: false } }))}>Tamam</Button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.deleteTodo.sureModalVisual} toggle={this.toggleSureModalDeleteTodo}
                    className={'modal-warning ' + this.props.className}>

                    <ModalHeader toggle={this.toggleSureModalDeleteTodo}>Ekle</ModalHeader>
                    
                    <ModalBody>
                        Görevi eklemek istediğinize emin misiniz?
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="warning"
                            onClick={() => this.deleteTodoPress(this.state.deleteTodo.todoId)}>Evet</Button>{' '}
                        <Button color="secondary" onClick={this.toggleSureModalDeleteTodo}>Geri Dön</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.deleteTodo.isRequesting}
                    className={'modal-info ' + this.props.className}>
                    
                    <ModalHeader>Bilgilendirme</ModalHeader>
                    
                    <ModalBody>
                        İşleminiz gerçekleştiriliyor. Lütfen bekleyiniz...
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.deleteTodo.isSuccess}
                    className={'modal-success ' + this.props.className}>
                    
                    <ModalHeader>İşleminiz Başarılı</ModalHeader>
                    
                    <ModalBody>
                        Görev başarılı bir şekilde eklenmiştir.
                    </ModalBody>

                    <ModalFooter>
                        <Button 
                            color="success"
                            onClick={() => this.setState(prevState => ({ deleteTodo: {...prevState.deleteTodo, isSuccess: false } }))}>
                                Tamam
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.deleteTodo.isFailed}
                    className={'modal-danger ' + this.props.className}>
                    
                    <ModalHeader>İşleminiz Hatalı</ModalHeader>
                    
                    <ModalBody>
                        Görev eklenirken bir hata meydana geldi lütfen tekrar deneyiniz.
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="danger"
                            onClick={() => this.setState(prevState => ({ deleteTodo: { ...prevState.deleteTodo, isFailed: false } }))}>Tamam</Button>
                    </ModalFooter>
                </Modal>


                <button>Yapılacaklar</button>
                <button>Yapılıyor</button>
                <button>Tamamlandı</button>
                <button onClick={this.toggleInputModalAddTodo}>Ekle</button>

                <ReactTable 
                    columns={this.columns} 
                    data={this.props.todos}
                    filterable={true}
                    pageSize={10}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    todo: state.todos,
    todos: state.todos.todos
});

const mapDispatchToProps = (dispatch) => ({
    getTodos: () => fetchTodos(dispatch),
    todoAdd: (todo) => addTodo(dispatch, todo),
    todoDelete: (todoId) => deleteTodo(dispatch, todoId)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
