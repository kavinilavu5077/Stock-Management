import React from 'react';
import styles from './editform.module.css';

const EditForm = ({ data, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  
return (
  <div className={styles.gradientContainer}>
    <div className={styles.contentWrapper}>
      <div className={styles.pageContent}>
        <div className={styles.container}>
          <div className={styles.formContainer}>
            <h2 className={styles.heading}>Edit Equipment</h2>
            <form onSubmit={handleSubmit}>
              {Object.keys(formData).map((key) => (
                <div key={key} className={styles.labelContainer}>
                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <div className={styles.inputContainer}>
                    <input
                      type="text"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      disabled={key === 'id'}
                    />
                  </div>
                </div>
              ))}
              <div className={styles.buttonWrapper}>
                <button className={styles.submitButton} type="submit">
                  Save
                </button>
                <button
                  className={styles.cancelButton}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);


};

export default EditForm;
