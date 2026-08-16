import { useState } from 'react';

const options = [
  { id: 'a', label: 'Sí. Toda compra es una operación controlada.' },
  { id: 'b', label: 'No. Con los hechos dados, es una operación entre partes independientes.' },
  { id: 'c', label: 'Sí, si el monto es material.' },
];

export function FormativeCheck() {
  const [selected, setSelected] = useState<string>('');
  const [checked, setChecked] = useState(false);
  const correct = selected === 'b';

  return (
    <section className="quiz-card" aria-labelledby="check-title">
      <div className="eyebrow">Check your understanding</div>
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
      {checked && (
        <div className={correct ? 'feedback correct' : 'feedback retry'} role="status">
          <strong>{correct ? 'Correcto.' : 'No todavía.'}</strong>{' '}
          {correct
            ? 'La relación entre las partes es un hecho esencial para identificar una operación controlada.'
            : 'La mera existencia de una compra no la convierte en controlada. Revisa primero quiénes son las partes y si existe relación entre ellas.'}
          <p className="feedback-note">Este ejercicio es formativo y no constituye evidencia para una certificación.</p>
        </div>
      )}
    </section>
  );
}
