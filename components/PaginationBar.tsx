import PropTypes from 'prop-types'
import React from 'react'
import { range } from 'lodash'
import { Pagination } from 'react-bootstrap'

const PADDING = 5

const FirstPaginationItem = ({ onClick }) => (
  <Pagination.First onClick={() => onClick(1)} />
)

const LastPaginationItem = ({ onClick, totalPages }) => (
  <Pagination.Last onClick={() => onClick(totalPages)} />
)

const PrevPaginationItem = ({ onClick, prevPage }) => (
  <Pagination.Prev onClick={() => onClick(prevPage)} />
)

const NextPaginationItem = ({ onClick, nextPage }) => (
  <Pagination.Next onClick={() => onClick(nextPage)} />
)

const Gap = () => (
  <Pagination.Ellipsis />
)

const PaginationBar = ({ pagination, onPaginationClick }) => {
  const currentPage = pagination.current_page
  const totalPages = pagination.total_pages

  // 最初のページ
  const firstPage = currentPage > 1 ? <FirstPaginationItem onClick={onPaginationClick} /> : null

  // 最後のページ
  const lastPage =
    currentPage !== totalPages ? <LastPaginationItem onClick={onPaginationClick} totalPages={totalPages} /> : null

  // 1つ戻る
  const previousPage =
    currentPage >= 2 ? <PrevPaginationItem onClick={onPaginationClick} prevPage={currentPage - 1} /> : null

  // 1つ進む
  const nextPage =
    currentPage + 1 <= totalPages ? <NextPaginationItem onClick={onPaginationClick} nextPage={currentPage + 1} /> : null

  // 現在のページと現在のページの左右にPADDINGで指定した数のアイテムを作成します
  const pages = [
    ...range(currentPage - PADDING, currentPage).filter(page => page >= 1),
    ...range(currentPage, currentPage + PADDING + 1).filter(page => page <= totalPages)
  ].map(page => {
    // 現在のページかどうかを判定
    const isCurrent = page === currentPage
    // 現在のページはspanで出力する
    // const paginationItem = isCurrent ? (
    //   <span>{page}</span>
    // ) : (
    //   <button type="button" onClick={() => onPaginationClick(page)}>
    //     {page}
    //   </button>
    // )

    // return (
    //   <li className="pagination-item" key={page}>
    //     {paginationItem}
    //   </li>
    // )
    return (
      totalPages == 1 ? <div key={0}></div> :
      <Pagination.Item onClick={() => onPaginationClick(page)} active={isCurrent} key={ page }>{page}</Pagination.Item>
    )

  })

  // 左右に `...` を表示する条件を追加
  const leftGap = currentPage > PADDING + 1 ? <Gap /> : null
  const rightGap = currentPage + PADDING < totalPages ? <Gap /> : null

  return (
    <Pagination>
      {firstPage}
      {previousPage}
      {leftGap}
      {pages}
      {rightGap}
      {nextPage}
      {lastPage}
    </Pagination>
  )
}

FirstPaginationItem.propTypes = {
  onClick: PropTypes.func.isRequired
}

LastPaginationItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired
}

PrevPaginationItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  prevPage: PropTypes.number.isRequired
}

NextPaginationItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  nextPage: PropTypes.number.isRequired
}

PaginationBar.propTypes = {
  onPaginationClick: PropTypes.func.isRequired,
  pagination: PropTypes.object.isRequired
}

export default PaginationBar