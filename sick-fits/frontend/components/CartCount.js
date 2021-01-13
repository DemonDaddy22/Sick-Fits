import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ANIMATION_DURATION = 500;

const AnimationStyles = styled.span`
    position: relative;
    .count {
        display: block;
        position: relative;
        transition: all ${ANIMATION_DURATION}ms;
        backface-visibility: hidden;
    }
    .count-enter {
        transform: scale(2) rotateX(0.5turn);
    }
    .count-enter-active {
        transform: rotateX(0);
    }
    .count-exit {
        position: absolute;
        top: 0;
        transform: rotateX(0);
    }
    .count-exit-active {
        transform: scale(2) rotateX(0.5turn);
    }
`;

const Dot = styled.div`
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.white};
    border-radius: 50%;
    padding: 0.5rem;
    line-height: 2rem;
    min-width: 3rem;
    margin-left: 1rem;
    font-weight: 100;
    font-feature-settings: 'tnum';
    font-variant-numeric: tabular-nums;
`;

const CartCount = ({ count }) => <AnimationStyles>
    <TransitionGroup>
        <CSSTransition unmountOnExit className='count' classNames='count' key={count} timeout={{ enter: ANIMATION_DURATION, exit: ANIMATION_DURATION }}>
            <Dot>{count}</Dot>
        </CSSTransition>
    </TransitionGroup>
</AnimationStyles>;

export default CartCount;