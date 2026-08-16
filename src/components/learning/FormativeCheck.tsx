import { useState } from 'react';

export type FormativeOption = {
  id: string;
  label: string;
  feedback: string;
};

export type FormativeCheckData = {
  id: string;
  title: string;
  prompt: string;
  correctOptionId: string;
  options: FormativeOption[];
};

type Props = {
  check: FormativeCheckData;
  onCorrect?: () => void;
};

export function FormativeCheck({ check, onCorrect }: Props) {
  const [selected, setSelected] = useState<string>('');
  const [checked, setChecked] = useState(false);
  const correct = selected === check.correctOptionId;
  const selectedOption = check.options.find((option) => option.id === selected);

  const handleCheck = () => {
    setChecked(true);
    if (correct) onCorrect?.();
  };

  return (
    <section className="quiz-card" aria-labelledby={`${check.id}-title`}>
      <div className="eyebrow">Ponlo a prueba</div>
      <h2 id={`${check.id}-title`}>{check.title}</h2>
      <p>{check.prompt}</p>
      <fieldset>
        <legend className="sr-only">Selecciona una respuesta</legend>
        {check.options.map((option) => (
          <label className="quiz-option" key={option.id}>
            <input
              type="radio"
              name={check.id}
              value={option.id}
              checked={selected === option.id}
              onChange={() => { setSelected(option.id); setChecked(false); }}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
      <button className="button primary" type="button" disabled={!selected} onClick={handleCheck}>
        Comprobar
      </button>
      {checked && selectedOption && (
        <div className={correct ? 'feedback correct' : 'feedback retry'} role="status">
          <strong>{correct ? 'Correcto.' : 'No todavía.'}</strong>{' '}{selectedOption.feedback}
          <p className="feedback-note">Este ejercicio es formativo y no constituye evidencia para una certificación.</p>
        </div>
      )}
    </section>
  );
}
