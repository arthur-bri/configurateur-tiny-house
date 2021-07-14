import React from 'react'
import { ReactComponent as Arrow } from '../assets/icons/arrow.svg'
import { ReactComponent as Skip } from '../assets/icons/skip.svg'
import { ReactComponent as Plus } from "../assets/icons/plus.svg"
import { ReactComponent as Cottage } from "../assets/icons/cottage.svg"

import styled from "styled-components"

const icons = {
  arrow: <Arrow />,
  skip: <Skip />,
  plus: <Plus />,
  cottage: <Cottage />
}

const IconWrapper = styled.div<IconProps>`
  display: flex;
  justify-content: center;
  
  > svg {
    stroke: ${({ color }) => color};
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    stroke-width: ${({ strokeWidth }) => strokeWidth};
  }
`

export type IconProps = {
  kind: keyof typeof icons,
  color?: string;
  width?: string;
  height?: string;
  strokeWidth?: number;
}

export const Icon: React.FC<IconProps> = props =>
  <IconWrapper {...props}>{icons[props.kind]}</IconWrapper>

Icon.defaultProps = {
  color: 'white',
  strokeWidth: 1.5,
  width: '20px',
  height: '20px'
}
