import React from 'react'
import styled from "styled-components";

type DotsProps = {
  itemsCount: number;
  selected: number[];
  active: number[];
}

const DotsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const DotWrapper = styled.div<DotProps>`
  display: block;
  position: relative;
  width: 10px;
  height: 10px;
  margin: 0.2rem;
  background: ${({isActive}) => isActive ? 'orange': 'var(--primary)'};
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: ${({isSelected}) => isSelected ? '0 0 0 2px orange' : 'none'};
`

type DotProps = {
  isActive: boolean;
  isSelected: boolean;
}

const Dot: React.FC<DotProps> = props => {
  return <DotWrapper {...props} />
}

export const Dots: React.FC<DotsProps> = ({itemsCount, active, selected}) => {
  return <DotsWrapper>
    {[...Array(itemsCount)].map((item, index) => <Dot
      isActive={active.includes(index)}
      isSelected={selected.includes(index)}/>)}
  </DotsWrapper>
}