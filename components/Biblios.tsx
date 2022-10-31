import { useEffect, useState, useRef } from 'react'
import { useBiblios, BibliosFilterParams } from '../lib/useBiblios'
import { BiblioForm } from '../lib/useBiblio'
import Loading from './Loading'
import { Row, Col, Table, Button, Form, Badge, Modal, DropdownButton, Dropdown } from 'react-bootstrap'
import Biblio from '../components/Biblio'
import PaginationBar from '../components/PaginationBar'
import BibliosList from './BibliosList'
import SearchService from './SearchSeavice'
import { SearchServiceTypes } from '../lib/useSearchService' // オブジェクトなので注意 {'search_ndl': "国会図書館検索", 'search_rakuten': "Rakuten検索"}
import { isEmpty } from '../lib/utility'


export default function Biblios(props) {
  const {biblios, pagination, readingBiblioIds, isFinished, categories, formats, filterParams, setFilter, reloadPage, toggleReadlogBiblio, scrapeAmazonUrl} = useBiblios(props.bibliotecaID)
  const [paginationTabs, setPaginationTabs] = useState([])
  const [editBiblioID, setEditBiblioID] = useState(null)
  const [editBiblioObj, setEditBiblioObj] = useState(null)
  const [showScrapingModal, setShowScrapingModal] = useState(false)
  const [searchServiceName, setSearchServiceName] = useState(null) // SerachServiceModal の表示スイッチを兼用
  const [biblioFilterParams, setBiblioFilterParams] = useState<BibliosFilterParams>({page: 1, condition: "", category: "", word: ""})

  const refScrapeAmazonUrl = useRef(null)
  const refSearchWordField = useRef(null)
  const conditionOptions = ['未読', '電', '紙', '既読', '中断']

  useEffect(() => {
    if (biblios && isFinished) {
      //console.log(`get biblioFilterParams: ${JSON.stringify(filterParams)}`)
      if (!isEmpty(filterParams)) {
        setBiblioFilterParams(filterParams)
      }
    }
  },[biblios, isFinished])

  const switchFilterParams = (_filterParam) => {
    setBiblioFilterParams(_filterParam)
    setFilter(_filterParam)
  }

  const setBibliosPage = (page) => {
    const _filterParam = {...biblioFilterParams}
    _filterParam.page = page
    switchFilterParams(_filterParam)
  }

  useEffect(() => {
    if (pagination && isFinished) {
      const _paginationTabs = PaginationBar({pagination,  onPaginationClick: setBibliosPage})
      setPaginationTabs(_paginationTabs)
    }
  }, [pagination, isFinished])

  const setBibliosCondition = (condition) => {
    const _filterParam = {...biblioFilterParams}
    _filterParam.condition = condition
    switchFilterParams(_filterParam)
  }

  const ConditionSelector = () => (
    !biblioFilterParams ? <Loading /> :
    <Form.Select onChange={(e) => setBibliosCondition(e.target.value)} defaultValue={biblioFilterParams.condition}  className="col-auto">
      <option value="">全て</option>
      { conditionOptions.map(condition => (<option value={ condition } key={ condition }>{ condition }</option>))}
    </Form.Select>
  )

  const setBibliosCategory = (category) => {
    const _filterParam = {...biblioFilterParams}
    _filterParam.category = category
    switchFilterParams(_filterParam)
  }

  const CategorySelector = () => (
    !categories || !biblioFilterParams ? <Loading /> :
    <Form.Select onChange={(e) => setBibliosCategory(e.target.value)} defaultValue={biblioFilterParams.category}  className="col-auto">
      <option value="">[カテゴリ]</option>
      { categories.map(category => (<option value={ category } key={ category }>{ category }</option>))}
    </Form.Select>
  )

  const onBibliosSearchWord = () => {
    const _filterParam = {...biblioFilterParams}
    _filterParam.word = refSearchWordField.current.value
    switchFilterParams(_filterParam)
  }

  const resetBibliosSearchWord = () => {
    refSearchWordField.current.value = ""
    onBibliosSearchWord()
  }

  const onKeyDownSearchWord = (e) => {
    if (e.key === 'Enter') {
      onBibliosSearchWord()
    }
  }

  const SearchWordField = () => (
    !biblioFilterParams ? <Loading /> :
    <Row>
      <Col md="auto">
        <Form.Control ref={ refSearchWordField } placeholder="検索" defaultValue={ biblioFilterParams ? biblioFilterParams.word : "" } onKeyDown={ onKeyDownSearchWord} />
      </Col>
      <Col md="auto" className="pt-1">
        <Button size="sm" variant="outline-dark" onClick={ onBibliosSearchWord } className="me-1">検索</Button>
        <Button size="sm" variant="outline-dark" onClick={ resetBibliosSearchWord } className="me-1">リセット</Button>
      </Col>
    </Row>
  )

  const selectAddNew = (e) => {
    if (e == 'new') {
      const biblio = {} as BiblioForm
      biblio.biblioteca_id = props.bibliotecaID
      setEditBiblioObj(biblio)
    } else if (e == 'scraping_amazon') {
      setShowScrapingModal(true)
    } else if (SearchServiceTypes.hasOwnProperty(e)) {
      setSearchServiceName(e)
    }
  }

  const AddNewDropdown = () => (
    <DropdownButton variant="warning" title="Add New" onSelect={ (e) => selectAddNew(e) }>
      <Dropdown.Item eventKey="new">新規</Dropdown.Item>
      <Dropdown.Item eventKey="search_ndl">国会図書館検索</Dropdown.Item>
      <Dropdown.Item eventKey="search_rakuten">Rakuten検索</Dropdown.Item>
      <Dropdown.Item eventKey="scraping_amazon">Amazonスクレイプ</Dropdown.Item>
    </DropdownButton>
  )

  const Toolbar = () => (
    !pagination || !isFinished ? <Loading /> : 
    <Row>
      <Col md={8}>
        <Row className="g-1">
          <Col sm="auto"><ConditionSelector /></Col>
          <Col sm="auto"><CategorySelector /></Col>
          <Col sm="auto"><SearchWordField /></Col>
          <Col sm="auto"><Badge bg="secondary" className="mt-2">{pagination.total_count}</Badge></Col>
        </Row>
      </Col>
      <Col md={4}>
        <div className="float-end">{ paginationTabs }</div>
      </Col>
    </Row> 
  )

  const onEditBiblio = (e) => {
    const biblioID = e.currentTarget.dataset.biblioId
    setEditBiblioID(biblioID)
  }

  const onPushBiblio = (e) => {
    const biblioID = e.currentTarget.dataset.biblioId
    toggleReadlogBiblio(biblioID)
  }

  const setNullToEditBiblio = (onChange: boolean) => {
    if (onChange) {
      reloadPage()
    }
    setEditBiblioID(null)
    setEditBiblioObj(null)
  }

  const EditBiblioModal = () => (
    !editBiblioID  && !editBiblioObj ? <div></div> :
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered 
      show={editBiblioID ||  editBiblioObj}
      onHide={() => setNullToEditBiblio(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>図書情報</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Biblio 
          biblioID={editBiblioID} 
          biblioObj={editBiblioObj}
          categories={categories} 
          formats={formats}
          setNullToEditBiblio={(onChange) => setNullToEditBiblio(onChange)}
          reloadPage={reloadPage}
        />
      </Modal.Body>
    </Modal>
  )


  // スクレイプ ----------------------------------------------
  const onScrapeAmazon = async(e) => {
    e.preventDefault()
    setShowScrapingModal(false)
    const amazonUrl = refScrapeAmazonUrl.current.value
    const biblio = await scrapeAmazonUrl(amazonUrl)
    if (biblio) {
      setEditBiblioID(biblio.id)
    } else {
      alert("スクレイプ失敗")
    }
  }

  const ScrapingModal = () => (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered 
      show={showScrapingModal}
      onHide={() => setShowScrapingModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title><h5>AMAZONスクレイプ</h5></Modal.Title>
      </Modal.Header>
      <Modal.Body className="row g-1">
        <Form.Control type="text" name="amazonScrapeUrl" placeholder="Amazon Page URL" ref={refScrapeAmazonUrl} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-dark" size="sm" onClick={(e) => onScrapeAmazon(e)}>スクレイプ</Button>
      </Modal.Footer>
    </Modal>
  )

  // サービス検索 -----------------------------------------
  const pickBiblioFromSearchService = (biblioObj) => {
    setSearchServiceName(null)
    setEditBiblioObj(biblioObj)
  }

  const SearchServiceModal = () => (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered 
      show={searchServiceName !== null}
      onHide={() => setSearchServiceName(null)}
    >
      <Modal.Header closeButton>
        <Modal.Title><h5>{ SearchServiceTypes[searchServiceName] }</h5></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SearchService bibliotecaID={props.bibliotecaID} searchServiceName={ searchServiceName } pickBiblioFromSearchService={pickBiblioFromSearchService} />
      </Modal.Body>
    </Modal>
  )

  return (
    <Row>
      <Toolbar />
      <Table responsive="md" className="table-sm" hover>
        <thead>
          <tr>
            <th></th>
            <th style={{width: '90%'}}>タイトル/形式/メモ</th>
            <th style={{whiteSpace: 'nowrap'}}>前回</th>
            <th>
              <AddNewDropdown />
            </th>
          </tr>
        </thead>
        <tbody role="button">
          <BibliosList biblios={biblios} readingBiblioIds={readingBiblioIds} onEditBiblio={(e) => onEditBiblio(e)} onPushBiblio={(e) => onPushBiblio(e)}/>
        </tbody>
      </Table>
      <Row><div className="d-flex justify-content-center">{ paginationTabs }</div></Row>
      <EditBiblioModal />
      <ScrapingModal />
      <SearchServiceModal />
    </Row>
  )
}
