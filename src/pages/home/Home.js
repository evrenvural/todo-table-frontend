import React, { Component } from 'react';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import { 
    Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupAddon, 
    InputGroupText, Input, FormGroup
} from 'reactstrap';
import moment from 'moment';
import { fetchTodos, addTodo, updateTodo, deleteTodo, changeStatusNext, changeStatusPrev } from '../../redux/actions/todos';
import { connect } from 'react-redux';

class Home extends Component {
    constructor(){
        super();

        this.columnsWithoutStatusButtons = [
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
            },
            {
                Header: '',
                Cell: (row) => (
                    <Button onClick={() => this.toggleInputModalUpdateTodo(row.original.id, row.original)}>Düzenle</Button>
                ),
                width: 90,
                filterable: false
            },
            {
                Header: '',
                Cell: (row) => (
                    <Button onClick={() => this.toggleSureModalDeleteTodo(row.original.id)}>Sil</Button>
                ),
                width: 55,
                filterable: false
            }
        ]

        this.state = {
            tableStatus: "Todo",
            columns: this.columnsWithoutStatusButtons,
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
            },
            updateTodo: {
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
                },
                todoId: null
            },
            changeStatusNext: {
                sureModalVisual: false,
                isSuccess: false,
                isFailed: false,
                isRequesting: false,
                todoId: null
            },
            changeStatusPrev: {
                sureModalVisual: false,
                isSuccess: false,
                isFailed: false,
                isRequesting: false,
                todoId: null
            },
        }

        // Status buttons
        this.changeStatusNextColumn = {
            Header: '',
            Cell: (row) => (
                <Button onClick={() => this.toggleSureModalChangeStatusNext(row.original.id)}>+</Button>
            ),
            width: 50,
            filterable: false,
        }
        this.changeStatusPrevColumn = {
            Header: '',
            Cell: (row) => (
                <Button onClick={() => this.toggleSureModalChangeStatusPrev(row.original.id)}>-</Button>
            ),
            width: 50,
            filterable: false
        }
    }

    componentDidMount(){
        this.props.getTodos();
        // Status buttons control
        this.statusButtonsVisualControl();
    }

    componentDidUpdate(){
        // Status buttons control
        if(this.isStatusChanged){ 
            this.statusButtonsVisualControl();
            // For DidUpdate issue
            this.isStatusChanged = false;
        }
        
        // Request buttons control
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
        else if (this.state.updateTodo.isRequesting && !this.props.todo.isLoading) {
            if (this.props.todo.error) {
                this.setState(prevState => ({
                    updateTodo: { ...prevState.updateTodo,
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
                    updateTodo: { ...prevState.updateTodo,
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
        else if (this.state.changeStatusNext.isRequesting && !this.props.todo.isLoading) {
            if (this.props.todo.error) {
                this.setState(prevState => ({
                    changeStatusNext: { ...prevState.changeStatusNext,
                        sureModalVisual: false,
                        isSuccess: false,
                        isRequesting: false,
                        isFailed: true
                    }
                }));
            } 
            else {
                this.setState(prevState => ({
                    changeStatusNext: { ...prevState.changeStatusNext,
                        sureModalVisual: false,
                        isSuccess: true,
                        isRequesting: false,
                        isFailed: false
                    }
                }));
            }
        }
        else if (this.state.changeStatusPrev.isRequesting && !this.props.todo.isLoading) {
            if (this.props.todo.error) {
                this.setState(prevState => ({
                    changeStatusPrev: { ...prevState.changeStatusPrev,
                        sureModalVisual: false,
                        isSuccess: false,
                        isRequesting: false,
                        isFailed: true
                    }
                }));
            } 
            else {
                this.setState(prevState => ({
                    changeStatusPrev: { ...prevState.changeStatusPrev,
                        sureModalVisual: false,
                        isSuccess: true,
                        isRequesting: false,
                        isFailed: false
                    }
                }));
            }
        }
    }

    statusButtonsVisualControl = () => {
        if(this.state.tableStatus === "Todo"){ 
            this.setState({ columns : [this.changeStatusNextColumn, ...this.columnsWithoutStatusButtons] });
        }
        else if(this.state.tableStatus === "InProgress"){
            this.setState({ columns : [this.changeStatusNextColumn, this.changeStatusPrevColumn, ...this.columnsWithoutStatusButtons] });
        }
        else if(this.state.tableStatus === "Done"){ 
            this.setState({ columns : [this.changeStatusPrevColumn, ...this.columnsWithoutStatusButtons] });
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
        if(this.state.addTodo.inputModalVisual){
            this.setState(prevState => ({
                addTodo: { ...prevState.addTodo, 
                    inputModalVisual: !this.state.addTodo.inputModalVisual,
                    data: {
                        title: '',
                        description: '',
                        importantValue: '1',
                        date: moment(new Date().getTime()).format('YYYY-MM-DD')
                    } 
                }
            }));
        }
        else{
            this.setState(prevState => ({
                addTodo: { ...prevState.addTodo, 
                    inputModalVisual: !this.state.addTodo.inputModalVisual 
                }
            }));
        }
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

    toggleInputModalUpdateTodo = (todoId, todo) => {
        if(this.state.updateTodo.inputModalVisual){
            this.setState(prevState => ({
                updateTodo: { ...prevState.updateTodo,
                    inputModalVisual: !prevState.updateTodo.inputModalVisual, 
                    data: {
                        title: '',
                        description: '',
                        importantValue: '1',
                        date: moment(new Date().getTime()).format('YYYY-MM-DD')
                    },
                    todoId: null
                }
            }));
        }
        else {
            this.setState(prevState => ({
                updateTodo: { ...prevState.updateTodo,
                    inputModalVisual: !prevState.updateTodo.inputModalVisual, 
                    data: {
                        title: todo.title,
                        description: todo.description,
                        importantValue: todo.importantValue,
                        date: todo.date
                    },
                    todoId: todoId
                }
            })); 
        }
    }
    toggleSureModalUpdateTodo = () => {
        this.setState(prevState => ({
            updateTodo: { ...prevState.updateTodo, 
                inputModalVisual: !this.state.updateTodo.inputModalVisual,
                sureModalVisual: !this.state.updateTodo.sureModalVisual 
            }
        }));
    }
    updateTodoPress = (todoId, todo) => {
        this.props.todoUpdate(todoId, todo);

        this.setState(prevState => ({
            updateTodo: { ...prevState.updateTodo,
                inputModalVisual: false,
                isRequesting: true,
                data: {
                    title: '',
                    description: '',
                    importantValue: '1',
                    date: moment(new Date().getTime()).format('YYYY-MM-DD')
                },
                todoId: null
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

    toggleSureModalChangeStatusNext = (todoId) => {
        this.setState(prevState => ({
            changeStatusNext: { ...prevState.changeStatusNext,
                sureModalVisual: !prevState.changeStatusNext.sureModalVisual,
                todoId: todoId
            }
        }));
    }
    changeStatusNextPress = (todoId) => {
        this.props.statusNextChange(todoId);

        this.setState(prevState => ({
            changeStatusNext: { ...prevState.changeStatusNext,
                isRequesting: true,
                todoId: null
            }
        }));
    }

    toggleSureModalChangeStatusPrev = (todoId) => {
        this.setState(prevState => ({
            changeStatusPrev: { ...prevState.changeStatusPrev,
                sureModalVisual: !prevState.changeStatusPrev.sureModalVisual,
                todoId: todoId
            }
        }));
    }
    changeStatusPrevPress = (todoId) => {
        this.props.statusPrevChange(todoId);

        this.setState(prevState => ({
            changeStatusPrev: { ...prevState.changeStatusPrev,
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
                    
                    <ModalHeader toggle={this.toggleInputModalAddTodo}>Ekle</ModalHeader>
                    
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


                <Modal isOpen={this.state.updateTodo.inputModalVisual} toggle={this.toggleInputModalUpdateTodo}
                    className={'modal-warning ' + this.props.className}>
                    
                    <ModalHeader toggle={this.toggleInputModalUpdateTodo}>Güncelle</ModalHeader>
                    
                    <ModalBody>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText></InputGroupText>
                            </InputGroupAddon>
                            <Input
                                name="updateTodo.title" 
                                placeholder="Başlık"
                                onChange={this.handleChange}
                                value={this.state.updateTodo.data.title} 
                            />
                        </InputGroup>
                        <br/>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText></InputGroupText>
                            </InputGroupAddon>
                            <Input
                                name="updateTodo.description" 
                                placeholder="Açıklama"
                                onChange={this.handleChange}
                                value={this.state.updateTodo.data.description} 
                            />
                        </InputGroup>
                        <br />
                        <FormGroup>
                            <Input 
                                type="select" 
                                name="updateTodo.importantValue" 
                                onChange={this.handleChange} 
                                value={this.state.updateTodo.data.importantValue}>
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
                                name="updateTodo.date"
                                type="date"
                                onChange={this.handleDateChange}
                                value={moment(this.state.updateTodo.data.date).format('YYYY-MM-DD')}
                                />
                        </InputGroup>
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="warning"
                            onClick={() => this.toggleSureModalUpdateTodo()}>Güncelle</Button>{' '}
                        <Button color="secondary" onClick={this.toggleInputModalUpdateTodo}>Vazgeç</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.updateTodo.sureModalVisual} toggle={this.toggleSureModalUpdateTodo}
                    className={'modal-warning ' + this.props.className}>

                    <ModalHeader toggle={this.toggleSureModalUpdateTodo}>Güncelle</ModalHeader>
                    
                    <ModalBody>
                        Görevi güncellemek istediğinize emin misiniz?
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="warning"
                            onClick={() => this.updateTodoPress(this.state.updateTodo.todoId, this.state.updateTodo.data)}>Evet</Button>{' '}
                        <Button color="secondary" onClick={this.toggleSureModalUpdateTodo}>Geri Dön</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.updateTodo.isRequesting}
                    className={'modal-info ' + this.props.className}>
                    
                    <ModalHeader>Bilgilendirme</ModalHeader>
                    
                    <ModalBody>
                        İşleminiz gerçekleştiriliyor. Lütfen bekleyiniz...
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.updateTodo.isSuccess}
                    className={'modal-success ' + this.props.className}>
                    
                    <ModalHeader>İşleminiz Başarılı</ModalHeader>
                    
                    <ModalBody>
                        Görev başarılı bir şekilde güncellenmiştir.
                    </ModalBody>

                    <ModalFooter>
                        <Button 
                            color="success"
                            onClick={() => this.setState(prevState => ({ updateTodo: {...prevState.updateTodo, isSuccess: false } }))}>
                                Tamam
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.updateTodo.isFailed}
                    className={'modal-danger ' + this.props.className}>
                    
                    <ModalHeader>İşleminiz Hatalı</ModalHeader>
                    
                    <ModalBody>
                        Görev güncellenirken bir hata meydana geldi lütfen tekrar deneyiniz.
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="danger"
                            onClick={() => this.setState(prevState => ({ updateTodo: { ...prevState.updateTodo, isFailed: false } }))}>Tamam</Button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.deleteTodo.sureModalVisual} toggle={this.toggleSureModalDeleteTodo}
                    className={'modal-warning ' + this.props.className}>

                    <ModalHeader toggle={this.toggleSureModalDeleteTodo}>Sil</ModalHeader>
                    
                    <ModalBody>
                        Görevi silmek istediğinize emin misiniz?
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="warning"
                            onClick={() => this.deleteTodoPress(this.state.deleteTodo.todoId)}>Evet</Button>{' '}
                        <Button color="secondary" onClick={this.toggleSureModalDeleteTodo}>Vazgeç</Button>
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
                        Görev başarılı bir şekilde silinmiştir.
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
                        Görev silinirken bir hata meydana geldi lütfen tekrar deneyiniz.
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="danger"
                            onClick={() => this.setState(prevState => ({ deleteTodo: { ...prevState.deleteTodo, isFailed: false } }))}>Tamam</Button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.changeStatusNext.sureModalVisual} toggle={this.toggleSureModalChangeStatusNext}
                    className={'modal-warning ' + this.props.className}>

                    <ModalHeader toggle={this.toggleSureModalChangeStatusNext}>Sil</ModalHeader>
                    
                    <ModalBody>
                        Görevi silmek istediğinize emin misiniz?
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="warning"
                            onClick={() => this.changeStatusNextPress(this.state.changeStatusNext.todoId)}>Evet</Button>{' '}
                        <Button color="secondary" onClick={this.toggleSureModalChangeStatusNext}>Vazgeç</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.changeStatusNext.isRequesting}
                    className={'modal-info ' + this.props.className}>
                    
                    <ModalHeader>Bilgilendirme</ModalHeader>
                    
                    <ModalBody>
                        İşleminiz gerçekleştiriliyor. Lütfen bekleyiniz...
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.changeStatusNext.isSuccess}
                    className={'modal-success ' + this.props.className}>
                    
                    <ModalHeader>İşleminiz Başarılı</ModalHeader>
                    
                    <ModalBody>
                        Görev başarılı bir şekilde silinmiştir.
                    </ModalBody>

                    <ModalFooter>
                        <Button 
                            color="success"
                            onClick={() => this.setState(prevState => ({ changeStatusNext: {...prevState.changeStatusNext, isSuccess: false } }))}>
                                Tamam
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.changeStatusNext.isFailed}
                    className={'modal-danger ' + this.props.className}>
                    
                    <ModalHeader>İşleminiz Hatalı</ModalHeader>
                    
                    <ModalBody>
                        Görev silinirken bir hata meydana geldi lütfen tekrar deneyiniz.
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="danger"
                            onClick={() => this.setState(prevState => ({ changeStatusNext: { ...prevState.changeStatusNext, isFailed: false } }))}>Tamam</Button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.changeStatusPrev.sureModalVisual} toggle={this.toggleSureModalChangeStatusPrev}
                    className={'modal-warning ' + this.props.className}>

                    <ModalHeader toggle={this.toggleSureModalChangeStatusPrev}>Sil</ModalHeader>
                    
                    <ModalBody>
                        Görevi silmek istediğinize emin misiniz?
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="warning"
                            onClick={() => this.changeStatusPrevPress(this.state.changeStatusPrev.todoId)}>Evet</Button>{' '}
                        <Button color="secondary" onClick={this.toggleSureModalChangeStatusPrev}>Vazgeç</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.changeStatusPrev.isRequesting}
                    className={'modal-info ' + this.props.className}>
                    
                    <ModalHeader>Bilgilendirme</ModalHeader>
                    
                    <ModalBody>
                        İşleminiz gerçekleştiriliyor. Lütfen bekleyiniz...
                    </ModalBody>
                </Modal>

                <Modal isOpen={this.state.changeStatusPrev.isSuccess}
                    className={'modal-success ' + this.props.className}>
                    
                    <ModalHeader>İşleminiz Başarılı</ModalHeader>
                    
                    <ModalBody>
                        Görev başarılı bir şekilde silinmiştir.
                    </ModalBody>

                    <ModalFooter>
                        <Button 
                            color="success"
                            onClick={() => this.setState(prevState => ({ changeStatusPrev: {...prevState.changeStatusPrev, isSuccess: false } }))}>
                                Tamam
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.changeStatusPrev.isFailed}
                    className={'modal-danger ' + this.props.className}>
                    
                    <ModalHeader>İşleminiz Hatalı</ModalHeader>
                    
                    <ModalBody>
                        Görev silinirken bir hata meydana geldi lütfen tekrar deneyiniz.
                    </ModalBody>
                    
                    <ModalFooter>
                        <Button color="danger"
                            onClick={() => this.setState(prevState => ({ changeStatusPrev: { ...prevState.changeStatusPrev, isFailed: false } }))}>Tamam</Button>
                    </ModalFooter>
                </Modal>


                <Button onClick={() => { this.setState({tableStatus: "Todo"}); this.isStatusChanged = true; }}>Yapılacaklar</Button>
                <Button onClick={() => { this.setState({tableStatus: "InProgress"}); this.isStatusChanged = true; }}>Yapılıyor</Button>
                <Button onClick={() => { this.setState({tableStatus: "Done"}); this.isStatusChanged = true; }}>Tamamlandı</Button>
                <Button onClick={this.toggleInputModalAddTodo}>Ekle</Button>

                <ReactTable 
                    columns={this.state.columns} 
                    data={this.props.todos.filter(item => item.status === this.state.tableStatus)}
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
    todoUpdate: (todoId, todo) => updateTodo(dispatch, todoId, todo),
    todoDelete: (todoId) => deleteTodo(dispatch, todoId),
    statusNextChange: (todoId) => changeStatusNext(dispatch, todoId),
    statusPrevChange: (todoId) => changeStatusPrev(dispatch, todoId)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
