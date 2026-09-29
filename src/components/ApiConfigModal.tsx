import { useState } from "react";
import { X } from "lucide-react";
import { setApiKey as saveApiKey } from "../utils/storage";

interface ApiConfigModalProps {
  onClose: () => void;
  onSaved: () => void;
}

function ApiConfigModal({ onClose, onSaved }: ApiConfigModalProps) {
  const [apiKey, setApiKeyValue] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    saveApiKey(apiKey);
    onSaved();
    onClose();
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="modal-overlay active"
      role="presentation"
      onClick={handleBackdropClick}
    >
      <section
        className="modal-dialog api-config-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-config-title"
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close API configuration"
        >
          <X />
        </button>

        <h2 id="api-config-title">TMDB API Key</h2>

        <form className="api-config-form" onSubmit={handleSubmit}>
          <label>
            API key
            <input
              type="password"
              value={apiKey}
              onChange={(event) => setApiKeyValue(event.target.value)}
              placeholder="Paste your TMDB v3 API key"
            />
          </label>

          <button className="btn-primary" type="submit">Save API Key</button>
        </form>
      </section>
    </div>
  );
}

export default ApiConfigModal;
