import React from "react"
import Block from "./Block"
import { defaultProps } from "recompose"
import { compose } from "ramda"

const BlockList = ({ blocks, initDraggable }) => (
  <ul className="menu__tab-list menu__tab-list--primary">
    {blocks.map(({ items, name }, index) => (
      <li key={index} className="menu__tab-section">
        <span className="menu__tab-section-title">{name}</span>
        <ul className="menu__tab-list">
          {items.map((item, index) => (
            <li key={index} className="menu__tab-subsection">
              <Block data={item} initDraggable={initDraggable}>
                {item.blockType}
              </Block>
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
)

const enhance = compose(
  defaultProps({
    blocks: [
      {
        name: "Primary",
        items: [{ blockType: "Text", col: 12 }, { blockType: "Regular", col: 12 }, { blockType: "Empty", col: 12 }],
      },
    ],
  }),
)

export default enhance(BlockList)
