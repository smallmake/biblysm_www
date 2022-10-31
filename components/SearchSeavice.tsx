import { useEffect, useState, useRef } from 'react'
import Loading from './Loading'
import { Row, Col, Table, Button, Form, Badge, Modal, DropdownButton, Dropdown } from 'react-bootstrap'
import { useSearchService } from '../lib/useSearchService'

export default function SearchService(props) {
  const { searchedServiceBiblios, isFinished, searchService } = useSearchService(props.bibliotecaID, props.searchServiceName)
  const refSearchNdlField = useRef(null)

  const onSearchService = (e) => {
    e.preventDefault()
    searchService(refSearchNdlField.current.value)
  }

  const onKeyDownSearchService = (e) => {
    if(e.key === 'Enter') {
      onSearchService(e)
    }
  }

  const onSelectBiblio = (index) => {
    const biblioObj = searchedServiceBiblios[index]
    props.pickBiblioFromSearchService(biblioObj)
  }

  const SearchedResults = () => {
    if (!searchedServiceBiblios || !isFinished ) {
      return <Loading />
    }
    if ( searchedServiceBiblios.length == 0 ) {
      let resultZeroMsg = "検索してください。"
      if (refSearchNdlField.current.value.length > 0) {
        resultZeroMsg = "指定ワードで検索されたものはありません。"
      }
      return <Row className="py-2"><Col className="text-muted text-center">{ resultZeroMsg }</Col></Row>
    }
    return (
      <Table striped bordered hover responsive="sm" className="small">
        <tbody role="button" >
        { searchedServiceBiblios.map((foundBiblio, index) => (
          <tr key={index} onClick={() => onSelectBiblio(index)}>
            <td>
              <div style={{ height: '1.2em', overflow: 'hidden'}}>
                {foundBiblio.title}/{foundBiblio.author}
              </div>
              <div style={{ marginTop: '4px', height: '1.2em', overflow: 'hidden', fontSize: '0.8em'}} className="text-muted">
                {foundBiblio.description.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'')}
              </div>
            </td>
            <td className="text-center">
              <div style={{ whiteSpace: 'nowrap'}}>
              {foundBiblio.published_at ? foundBiblio.published_at : "---"}
              </div>
              <div style={{ height: '1.2em', overflow: 'hidden'}}>
                {foundBiblio.publisher}
              </div>
            </td>
          </tr>
        ))}
        </tbody>
      </Table>
    )
  }

  return (
    <Row>
      <Row className="mb-3">
        <Col md="10"><Form.Control type="text" placeholder="検索文字列" ref={refSearchNdlField} onKeyDown={onKeyDownSearchService}/></Col>
        <Col md="2"><Button variant="outline-dark" onClick={(e) => onSearchService(e)}>検索</Button></Col>
      </Row>
      <SearchedResults />
    </Row>
  )
}