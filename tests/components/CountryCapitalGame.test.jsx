import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountryCapitalGame from '../../src/components/CountryCapitalGame.jsx';

const dataCountryCapital = {
  Germany: { capital: "Berlin", code: "DE" },
  Azerbaijan: { capital: "Baku", code: "AZ" },
  Brazil: { capital: "Brasília", code: "BR" },
  Canada: { capital: "Ottawa", code: "CA" },
  Australia: { capital: "Canberra", code: "AU" },
  Japan: { capital: "Tokyo", code: "JP" },
  Portugal: { capital: "Lisbon", code: "PT" }
};

describe('CountryCapitalGame', () => {
  it('should display buttons for each country and capital', () => {
    render(<CountryCapitalGame data={dataCountryCapital}/>);

    Object.keys(dataCountryCapital).forEach(country => {
      // Check that the country is a descendant of the div with dataType "Country"
      const countryContainer = screen.getByTestId('Country');
      expect(within(countryContainer).getByText(textContent => textContent.includes(country))).toBeInTheDocument();

      // Check that the capital is a descendant of the div with dataType "Capital"
      const capitalContainer = screen.getByTestId('Capital');
      expect(within(capitalContainer).getByText(textContent => textContent.includes(dataCountryCapital[country].capital))).toBeInTheDocument();
    });
  });

  it('should display buttons in a random order', () => {
    // Render twice and expect they are different. Will fail one in a million
    // TODO: better
    const { container: firstRender } = render(<CountryCapitalGame data={dataCountryCapital}/>);
    const firstOrder = firstRender.textContent;

    const { container: secondRender } = render(<CountryCapitalGame data={dataCountryCapital}/>);
    const secondOrder = secondRender.textContent;

    expect(firstOrder).not.toEqual(secondOrder);
  });

  it('should change the background color of the button to blue when clicked', () => {
    render(<CountryCapitalGame data={dataCountryCapital}/>);

    const button = screen.getByText(textContent => textContent.includes("Germany"));
    fireEvent.click(button);

    const computedStyles = window.getComputedStyle(button);
    expect(computedStyles.backgroundColor).toBe('blue');
  });

  it('should remove correct pair buttons when both are clicked', () => {
    render(<CountryCapitalGame data={dataCountryCapital}/>);

    // Click the buttons
    fireEvent.click(screen.getByText(textContent => textContent.includes("Germany")));
    fireEvent.click(screen.getByText(textContent => textContent.includes("Berlin")));

    // Get the containers by their testId
    const countryContainer = screen.getByTestId('Country');
    const capitalContainer = screen.getByTestId('Capital');

    // Check if Germany and Berlin are not inside those containers respectively
    expect(within(countryContainer).queryByText(textContent => textContent.includes("Germany"))).not.toBeInTheDocument();
    expect(within(capitalContainer).queryByText(textContent => textContent.includes("Berlin"))).not.toBeInTheDocument();
  });

  it('should show in correct answers when correct pair buttons are clicked', () => {
    render(<CountryCapitalGame data={dataCountryCapital}/>);

    // Click the buttons
    fireEvent.click(screen.getByText(textContent => textContent.includes("Germany")));
    fireEvent.click(screen.getByText(textContent => textContent.includes("Berlin")));

    expect(screen.queryByText(textContent => textContent.includes("Germany - Berlin"))).toBeInTheDocument();
  });

  it('should turn the background color to red for an incorrect pair', () => {
    render(<CountryCapitalGame data={dataCountryCapital}/>);

    const button1 = screen.getByText(textContent => textContent.includes("Germany"));
    const button2 = screen.getByText(textContent => textContent.includes("Baku"));
    fireEvent.click(button1);
    fireEvent.click(button2);

    const computedStyles1 = window.getComputedStyle(button1);
    const computedStyles2 = window.getComputedStyle(button2);
    expect(computedStyles1.backgroundColor).toBe('red');
    expect(computedStyles2.backgroundColor).toBe('red');
  });

  it('should restore default background color after wrong selection and new button click', () => {
    render(<CountryCapitalGame data={dataCountryCapital}/>);

    const button1 = screen.getByText(textContent => textContent.includes("Germany"));
    const button2 = screen.getByText(textContent => textContent.includes("Baku"));
    const button3 = screen.getByText(textContent => textContent.includes("Brazil"));
    fireEvent.click(button1);
    fireEvent.click(button2);
    fireEvent.click(button3);

    const computedStyles1 = window.getComputedStyle(button1);
    const computedStyles2 = window.getComputedStyle(button2);
    const computedStyles3 = window.getComputedStyle(button3);
    expect(computedStyles1.backgroundColor).toBe('inherit');
    expect(computedStyles2.backgroundColor).toBe('inherit');
    expect(computedStyles3.backgroundColor).toBe('blue');
  });

  it('should display a congratulatory message when no buttons are left', () => {
    const { container } = render(<CountryCapitalGame data={dataCountryCapital}/>);

    Object.keys(dataCountryCapital).forEach(country => {
      fireEvent.click(screen.getByText(textContent => textContent.includes(country)));
      fireEvent.click(screen.getByText(textContent => textContent.includes(dataCountryCapital[country].capital)));
    });

    expect(screen.getByText(textContent => textContent.includes("Congratulations"))).toBeInTheDocument();
  });

  it('should display correct answers in the div', () => {
    render(<CountryCapitalGame data={dataCountryCapital}/>);

    fireEvent.click(screen.getByText(textContent => textContent.includes("Germany")));
    fireEvent.click(screen.getByText(textContent => textContent.includes("Berlin")));

    expect(screen.getByText(textContent => textContent.includes("Correct Answers:"))).toBeInTheDocument();
    expect(screen.getByText(textContent => textContent.includes("Germany - Berlin"))).toBeInTheDocument();
  });
});