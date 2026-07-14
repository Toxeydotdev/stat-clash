import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';
import { MetricBar } from './metric-bar';

function ButtonHarness() {
  const [status, setStatus] = useState('Ready');

  return (
    <>
      <Button onClick={() => setStatus('Queued')}>Start clash</Button>
      <output>{status}</output>
    </>
  );
}

function setup() {
  const user = userEvent.setup();
  render(<ButtonHarness />);

  return { user };
}

describe('design system', () => {
  it('lets a user activate a button', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('button', { name: 'Start clash' }));

    expect(screen.getByText('Queued')).toBeTruthy();
  });

  it('announces metric values and the winning edge', () => {
    render(
      <MetricBar
        label="K/D ratio"
        leftLabel="NullByte"
        leftValue="2.14"
        leftWeight={100}
        rightLabel="PixelVex"
        rightValue="1.97"
        rightWeight={92}
        winner="left"
      />,
    );

    expect(screen.getByText('K/D ratio')).toBeTruthy();
    expect(screen.getByText('EDGE')).toBeTruthy();
    expect(screen.getByText('NullByte:')).toBeTruthy();
  });
});
