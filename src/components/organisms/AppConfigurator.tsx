import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import styled from 'styled-components'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import {
  countValidItems,
  isStepActive,
  isStepEnabled,
  isStepValidated,
  mapSettingsResults,
  mapSuppliersResults
} from '../../utils/notion'
import { device } from '../../theme/device'
import { RootState } from '../../store'
import { StepProps } from '../molecules/Step'
import { ConfiguratorBanner } from '../molecules/ConfiguratorBanner'
import { Steps } from './Steps'
import { Summary } from './Summary'

const AppConfiguratorWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  @media screen and ${device.laptop} {
    margin-top: var(--header-height);
  }
`

const Configurator = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  width: 100%;

  @media screen and ${device.laptop} {
    width: 80vw;
  }
`

const ConfiguratorMain = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1 1 80vw;
  position: relative;
  width: 100%;

  @media screen and ${device.laptop} {
    margin-top: var(--configurator-banner-height);
  }
`

const StepsInfo = styled.div`
  display: none;
  padding: 0 2rem 2rem;

  @media screen and ${device.laptop} {
    display: block;
  }

  h2 {
    margin: 0
  }
`

const StepsWrapper = styled.div`
  width: 100%;
`

export const AppConfigurator: React.FC = () => {
  const SECTION_ID = 'a8afc4ffdb18418aab047c5628f365c2'
  const SETTINGS_ID = '3c3936ea062842bdada70c592e90b46b'
  const SUPPLIERS_ID = '978ebebdf9db43219a0a1cd5497fedef'

  const dispatch = useDispatch()

  const isLaptop = useMediaQuery('laptop')

  const isLoaded = useSelector((state: RootState) => state.configurator.isLoaded)
  const storeSteps = useSelector((state: RootState) => state.steps)

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`/blocks/${SECTION_ID}/children`)
      const stepsIds = data.results?.map((item: any) => item.id)

      const { data: settingsData } = await axios.post(`/databases/${SETTINGS_ID}/query`)
      const settings = settingsData.results.map((result: any) => mapSettingsResults(result))

      const { data: suppliersData } = await axios.post(`/databases/${SUPPLIERS_ID}/query`)
      const suppliers = suppliersData.results.map((result: any) => mapSuppliersResults(result))

      const steps: StepProps[] = await Promise.all(
        stepsIds.map(async (id: string, index: number) => {
          const { data } = await axios.get(`/databases/${id}`)
          const title = data.title[0].plain_text
          const relatedSettings = settings.find((setting: any) => setting.title === title)

          const { data: postsData } = await axios.post(`/databases/${id}/query`)
          const itemsCount = countValidItems(postsData.results)

          return {
            title,
            itemsCount,
            notionDbId: id,
            isActive: storeSteps.length ? isStepActive(storeSteps, title) : index === 0,
            isEnabled: storeSteps.length ? isStepEnabled(storeSteps, title) : index === 0,
            isValidated: storeSteps.length ? isStepValidated(storeSteps, title) : false,
            ...relatedSettings
          }
        })
      )
      dispatch({ type: 'steps/set-all', payload: steps.filter((step: StepProps) => step.itemsCount > 0) })
      dispatch({ type: 'suppliers/set-all', payload: suppliers })
      dispatch({ type: 'configurator/set-loaded' })
    })()
    // eslint-disable-next-line
  }, [])

  return (
    <AppConfiguratorWrapper>
      <ConfiguratorBanner/>
      <Configurator>
        <ConfiguratorMain>
          <StepsWrapper>
            {isLaptop &&
            <StepsInfo>
              <h2>Choisissez les composants de votre tiny house</h2>
            </StepsInfo>
            }
            <Steps steps={storeSteps} isLoading={!isLoaded}/>
          </StepsWrapper>
          <Summary/>
        </ConfiguratorMain>
      </Configurator>
    </AppConfiguratorWrapper>
  )
}
