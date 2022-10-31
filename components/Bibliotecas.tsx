import { useContext, useEffect, useState } from 'react'
import { useBibliotecas } from '../lib/useBibliotecas'
import Loading from './Loading'
import { Container, Row, Col, Dropdown, Tabs, Tab, DropdownButton, Button } from 'react-bootstrap'
import Biblios from './Biblios'
import Readlogs from './Readlogs'
import { searchByIdOf } from '../lib/utility'

export default function Bibliotecas(props) {
  
  const { bibliotecas, isFinished, currentBibliotecaID, setCurrentBibliotecaID } = useBibliotecas()
  const [ bibliotecaID, setBibliotecaID ] = useState(null)
  const [ listMode, setListMode ] = useState('biblioList')

  useEffect(() => { // ２つの値の一瞬の差分を画面切り替えのために使用
    setBibliotecaID(currentBibliotecaID)
  },[currentBibliotecaID])
  
  const onSelectBiblioteca = (index) => {
    setListMode('biblioList')
    setCurrentBibliotecaID(bibliotecas[index].id)
  }

  const BibliotecaSelector = () => {
    if (!bibliotecas || !isFinished) {
      return <Loading />
    } else {
      const searchedBiblioteca = searchByIdOf(bibliotecas, currentBibliotecaID)
      return (
        <DropdownButton
          variant="outline-dark"
          title={ searchedBiblioteca ? searchedBiblioteca.title : ""}
          id="dropdown-menu-align-right"
          onSelect={onSelectBiblioteca}
        >
          {bibliotecas.map( (biblioteca, index) => 
              <Dropdown.Item key={biblioteca.id} eventKey={index} >{ biblioteca.title }</Dropdown.Item>
          )}
        </DropdownButton>
      )
    }
  }

  const ListModeTab = () => (
    <Tabs
      id=""
      activeKey={listMode}
      onSelect={(k) => setListMode(k)}
      className="mb-3"
    >
      <Tab eventKey="biblioList" title="書籍リスト"></Tab>
      <Tab eventKey="readlogList" title="読書ログリスト"></Tab>
    </Tabs>
  )
  
  return (
    !bibliotecas || !isFinished ? <Loading /> : 
    <Container>
      <Row className="mb-2">
        <Col md="auto">
          <BibliotecaSelector />
        </Col>
        <Col md="auto">
          <ListModeTab />
        </Col>
      </Row>
      <Row>
        { 
          bibliotecaID != currentBibliotecaID ? <Loading /> :
              listMode == 'biblioList' ? 
                <Biblios bibliotecaID={ bibliotecaID }  /> : 
                <Readlogs bibliotecaID={ bibliotecaID } /> 
        }
      </Row>
    </Container>
  )
}
