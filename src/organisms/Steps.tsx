import { Step, StepProps } from "../molecules/Step"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { useDispatch } from "react-redux"
import { useMediaQuery } from "../hooks/useMediaQuery"
import { LoadingScreen } from "../molecules/LoadingScreen"

const StepWrapper = styled.div<Partial<StepProps>>`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding-bottom: 2rem;
  scroll-snap-type: y mandatory;
  overflow: scroll;
  height: 40rem;
  scroll-behavior: smooth;
`;

type StepsProps = {
    steps: StepProps[];
    isLoading: boolean;
    ref?: React.Ref<HTMLDivElement>;
}

export const Steps: React.FC<StepsProps> = ({ steps, isLoading }) => {
    const [enabledSteps, setEnabledSteps] = useState([steps?.[0]?.title] || [])
    const [visibleSteps, setVisibleSteps] = useState<number[]>([])
    const [activeStep, setActiveStep] = useState<StepProps | undefined>(steps[0])

    const isLaptop = useMediaQuery('laptop')

    const dispatch = useDispatch()

    useEffect(() => {
        !isLoading && setEnabledSteps(enabledSteps => [...enabledSteps, steps?.[0]?.title])
        // eslint-disable-next-line
    }, [isLoading])

    useEffect(() => {
        dispatch({type: 'steps/set-active', payload: activeStep})
    }, [activeStep, dispatch])

    useEffect(() => {
        dispatch({type: 'steps/set-enabled-all', payload: enabledSteps})
    }, [enabledSteps, dispatch])

    const handleStepDone = (index: number) => {
        if (index + 1 < steps.length) {
            setEnabledSteps((enabledSteps) => [...enabledSteps, steps[index + 1].title]);
            setActiveStep(steps[index + 1])
        }
    }

    const handleVisibilityChange = (index: number, visible: boolean) => {
        setVisibleSteps(visibleSteps => visible
          ? [...visibleSteps, index]
          : visibleSteps.filter(stepIndex => stepIndex !== index))
        if (visibleSteps.length > 1) {
            const firstStepVisible = steps[Math.min(...visibleSteps)]
            if (firstStepVisible.isEnabled) {
                // TODO : fix to set :
                // - the first visible item (on scroll)
                // - item must be active
                console.log('visible steps ', visibleSteps)
                setTimeout(() => {
                    dispatch({type: 'steps/set-active', payload: steps[Math.min(...visibleSteps)]})
                }, 100)
            }
        }
    }

    return (<StepWrapper id="steps">
        {!isLoading && steps
            .map((step, index) =>
            <Step {...step}
                  key={index}
                  onStepDone={() => handleStepDone(index)}
                  onVisibilityChange={(newVisibilityStatus) =>
                    handleVisibilityChange(index, newVisibilityStatus)}
                  isEnabled={enabledSteps.includes(step.title)}
                  showTitle={isLaptop}
            />)
        }
        {isLoading && <LoadingScreen />}
    </StepWrapper>)
};

