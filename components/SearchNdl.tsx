import { useEffect, useState, useRef } from 'react'
import Loading from './Loading'
import { Row, Col, Table, Button, Form, Badge, Modal, DropdownButton, Dropdown } from 'react-bootstrap'
import { useSearchNdl } from '../lib/useSearchNdl'

export default function SearchNdl(props) {
  const { searchedNdlBiblios, isFinished, searchNdl } = useSearchNdl(props.bibliotecaID)
  const refSearchNdlField = useRef(null)

  const onSearchNdl = (e) => {
    e.preventDefault()
    searchNdl(refSearchNdlField.current.value)
  }

  const SearchedResults = () => (
    <Row className="small">
      { searchedNdlBiblios.map((ndlBiblio, index) => (
        <Row key={index}>
          {ndlBiblio.title}/{ndlBiblio.author}
        </Row>
      ))}
    </Row>
  )

  return (
    <Row>
      <Row>
        <Col md="auto"><Form.Control type="text" placeholder="検索文字列" ref={refSearchNdlField} /></Col>
        <Col md="auto"><Button variant="outline-dark" size="sm" onClick={(e) => onSearchNdl(e)}>NDL検索</Button></Col>
      </Row>
      {
        !searchedNdlBiblios || !isFinished ? <Loading /> :
        searchedNdlBiblios.length == 0 ? <>結果なし</> : <SearchedResults />
      }
    </Row>
  )
}