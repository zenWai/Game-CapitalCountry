// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import shuffleArray from '../helpers/helperShuffleArray.js';
import countryCodeToFlagEmoji from '../helpers/countryCodeToFlagEmoji.js';

const CountryCapitalComponentDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  margin: 44px 10px;
`;

const DataTypeDiv = styled.div`
  margin: 10px 15px;
`;

const CorrectAnswersDiv = styled.div`
  margin-top: 20px;
  font-size: 18px;
  color: green;
`;

const CongratulationsDiv = styled.div`
  margin-top: 20px;
  font-size: 20px;
  color: green;
`;

const ButtonCountryCapitalGameStyle = styled.button`
  margin-right: 10px;

  color: ${({ $isSelected, $isDoubleSelected }) => {
    if ($isDoubleSelected || $isSelected) return 'white';
    return 'inherit';
  }};

  background-color: ${({ $isSelected, $isDoubleSelected }) => {
    if ($isDoubleSelected) return 'red';
    if ($isSelected) return 'blue';
    return 'inherit';
  }};
`;

function Buttons({
  data,
  onButtonClick,
  selected,
  answeredCorrectly,
  dataType,
  shuffledData,
}) {
  return shuffledData
    .filter((value) => !answeredCorrectly[value])
    .map((value) => {
      const displayText =
        dataType === 'Country'
          ? `${countryCodeToFlagEmoji(data[value].code)} ${value}`
          : value;

      return (
        <ButtonCountryCapitalGameStyle
          onClick={() => onButtonClick(value)}
          $isSelected={selected[value]}
          $isDoubleSelected={
            selected[value] && Object.keys(selected).length === 2
          }
          key={value}
        >
          {displayText}
        </ButtonCountryCapitalGameStyle>
      );
    });
}

function CountryCapitalButtons({
  dataType,
  shuffledData,
  selected,
  onButtonClick,
  answeredCorrectly,
  hasAnsweredEverythingCorrectly,
  data,
}) {
  if (shuffledData.length === 0 || hasAnsweredEverythingCorrectly) return null;

  return (
    <DataTypeDiv data-testid={`${dataType}`}>
      <strong>{dataType}:</strong>
      <div data-testid={`${dataType}Buttons`}>
        <Buttons
          shuffledData={shuffledData}
          data={data}
          selected={selected}
          onButtonClick={onButtonClick}
          answeredCorrectly={answeredCorrectly}
          dataType={dataType}
        />
      </div>
    </DataTypeDiv>
  );
}

function CorrectAnswers({ data, answeredCorrectly }) {
  if (Object.entries(answeredCorrectly).length === 0) return null;
  return (
    <CorrectAnswersDiv data-testid="CorrectAnswers">
      <strong>Correct Answers:</strong>
      <ul>
        {Object.keys(answeredCorrectly)
          .filter((country) => data[country])
          .map((country) => (
            <li key={country}>
              {countryCodeToFlagEmoji(data[country].code)} {country} -{' '}
              {data[country].capital}
            </li>
          ))}
      </ul>
    </CorrectAnswersDiv>
  );
}

function CongratulateUserAtEnd({ show }) {
  if (!show) return null;
  return (
    <CongratulationsDiv>
      Congratulations! You have answered everything correctly!
    </CongratulationsDiv>
  );
}

function CountryCapitalGame({ data }) {
  const [shuffledCountryData, setShuffledCountryData] = useState([]);
  const [shuffledCapitalData, setShuffledCapitalData] = useState([]);
  const [selected, setSelected] = useState({});
  const [lastSelected, setLastSelected] = useState(null);
  const [answeredCorrectly, setAnsweredCorrectly] = useState({});
  const hasAnsweredEverythingCorrectly =
    Object.entries(answeredCorrectly).length ===
    Object.entries(data).length * 2;

  useEffect(() => {
    setShuffledCountryData(shuffleArray(Object.keys(data)));
    setShuffledCapitalData(
      shuffleArray(
        Object.values(data).map((countryInfo) => countryInfo.capital),
      ),
    );
  }, [data]);

  function handleClickSelection(value) {
    const resetSelection = () => {
      setSelected({});
      setLastSelected(null);
    };

    const handleAnswerSelection = (value) => {
      const isAnsweredCorrectly =
        data[lastSelected]?.capital === value ||
        data[value]?.capital === lastSelected;

      if (isAnsweredCorrectly) {
        setAnsweredCorrectly((prev) => ({
          ...prev,
          [lastSelected]: true,
          [value]: true,
        }));
        resetSelection();
      } else {
        // Still select and logic for wrong answer is on the styles coloring red
        setSelected((prev) => ({ ...prev, [value]: true }));
        setLastSelected(null);
      }
    };

    // If the same value is clicked again
    if (value === lastSelected) {
      resetSelection();
      return;
    }

    // If there is a previous selection
    if (lastSelected) {
      handleAnswerSelection(value);
      return;
    }

    // lastSelected is null and counts as first selection
    setSelected({ [value]: true });
    setLastSelected(value);
  }

  return (
    <CountryCapitalComponentDiv data-testid="CountryCapitalComponent">
      <div data-testid="CountryCapitalButtons">
        <CountryCapitalButtons
          dataType="Country"
          data={data}
          shuffledData={shuffledCountryData}
          selected={selected}
          onButtonClick={handleClickSelection}
          answeredCorrectly={answeredCorrectly}
          hasAnsweredEverythingCorrectly={hasAnsweredEverythingCorrectly}
        />
        <CountryCapitalButtons
          dataType="Capital"
          data={data}
          shuffledData={shuffledCapitalData}
          selected={selected}
          onButtonClick={handleClickSelection}
          answeredCorrectly={answeredCorrectly}
          hasAnsweredEverythingCorrectly={hasAnsweredEverythingCorrectly}
        />
      </div>
      <CongratulateUserAtEnd show={hasAnsweredEverythingCorrectly} />
      <CorrectAnswers data={data} answeredCorrectly={answeredCorrectly} />
    </CountryCapitalComponentDiv>
  );
}

export default CountryCapitalGame;
