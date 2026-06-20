# Product Requirements Document
## Carbon Compass

**Version**: 1.1.0  
**Status**: Demo-ready

## Problem

Most people care about climate impact but do not know which personal habits matter most. Carbon Compass turns a broad sustainability problem into a personalised action path.

## Objective

Help users:

- understand their annual emissions
- identify the biggest carbon driver in their lifestyle
- receive realistic next actions instead of generic advice
- revisit progress through saved snapshots

## User Flow

1. Complete the calculator across four lifestyle sections.
2. Review total emissions and benchmark comparisons.
3. See the highest-impact category and category breakdown.
4. Generate a reduction plan with estimated savings.
5. Save and revisit entries in the timeline view.

## Functional Requirements

### Calculator

- Accept annual transport, home, diet, and consumption inputs
- Return total `kg CO2e`
- Return breakdown plus ranked categories
- Compare against global average and Paris-aligned targets

### Reduction Plan

- Generate three actionable reduction ideas
- Estimate annual savings for each idea
- Highlight a first move and monthly momentum framing
- Support fallback behavior when advanced cloud services are disabled

### Timeline

- Save a result snapshot with associated insights
- Display a history chart and detail table

### Privacy and Safety

- Avoid direct personal identity information
- Validate user inputs on both frontend and backend
- Rate-limit API access

## Non-Functional Requirements

- Responsive on mobile and desktop
- Accessible under WCAG-oriented patterns
- Covered by automated frontend and backend tests
- Deployable as a single Cloud Run service
