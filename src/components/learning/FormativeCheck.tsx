import { useState } from 'react';

const options = [
  {
    id: 'a',
    label: 'Sí. Toda compra es una operación controlada.',
    feedback: 'No toda compra es una operación controlada. Primero identifica quiénes son las partes y si existe una relación entre ellas.',
  },
  {
    id: 'b',
    label: 'No. Con los hechos dados, es una operación entre partes independientes.',
    feedback: 'Correcto. Con los hechos proporcionados, comprador y proveedor son partes independientes; por ello, la compra no es una operación controlada por ese solo hecho.',
  },
  {
    id: 'c',
    label: 'Sí, si el monto es material.',
    feedback: 'La materialidad del monto no determina por sí misma si una operación es controlada. Primero identifica quiénes son las partes y si existe una relación entre ellas.',
  },
];

export function FormativeCheck() {
  const [selected, setSelected] = useState<string>('');
  const [checked, setChecked] = useState(false);
  const correct = selected === 'b';
  const selectedOption = options.find((option) => option.id === selected);

  return (
    <section className="quiz-card" aria-labelledby="check-title">
      <div className="eyebrow">Ponlo a prueba</div>
      <h2 id="check-title">¿Es una operación controlada?</h2>
      <p>Una empresa compra materia prima a un proveedor totalmente independiente y no existe ninguna relación entre ambos. ¿La compra es una operación controlada por ese solo hecho?</p>
      <fieldset>
        <legend className="sr-only">Selecciona una respuesta</legend>
        {options.map((option) => (
          <label className="quiz-option" key={option.id}>
            <input
              type="radio"
              name="formative-check"
              value={option.id}
              checked={selected === option.id}
              onChange={() => { setSelected(option.id); setChecked(false); }}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
      <button className="button primary" type="button" disabled={!selected} onClick={() => setChecked(true)}>
        Comprobar
      </button>
      {checked && selectedOption && (
        <div className={correct ? 'feedback correct' : 'feedback retry'} role="status">
          <strong>{correct ? 'Correcto.' : 'No todavía.'}</strong>{' '}
          {correct ? selectedOption.feedback.replace(/^Correcto\.\s*/, '') : selectedOption.feedback}
          <p className="feedback-note">Este ejercicio es formativo y no constituye evidencia para una certificación.</p>
        </div>
      )}
    </section>
  );
}
