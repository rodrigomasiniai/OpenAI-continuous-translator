```javascript
// import PropTypes from 'prop-types';
import PropTypes from 'prop-types';
// import * as Yup from 'yup';
import * as Yup from 'yup';
// import { Formik } from 'formik';
import { Formik } from 'formik';
// import { useTheme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
// import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';

// import {
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText
} from '@mui/material';

// import { renderQuotaWithPrompt, showSuccess, showError, downloadTextAsFile } from 'utils/common';
import { renderQuotaWithPrompt, showSuccess, showError, downloadTextAsFile } from 'utils/common';
// import { API } from 'utils/api';
import { API } from 'utils/api';

const validationSchema = Yup.object().shape({
  is_edit: Yup.boolean(),
  name: Yup.string().required('Name cannot be empty'),
  quota: Yup.number().min(0, 'Must be greater than or equal to 0'),
  count: Yup.number().when('is_edit', {
    is: false,
    then: Yup.number().min(1, 'Must be greater than or equal to 1'),
    otherwise: Yup.number()
  })
});

const originInputs = {
  is_edit: false,
  name: '',
  quota: 100000,
  count: 1
};

const EditModal = ({ open, redemptiondId, onCancel, onOk }) => {
  const theme = useTheme();
  const [inputs, setInputs] = useState(originInputs);

  const submit = async (values, { setErrors, setStatus, setSubmitting }) => {
    setSubmitting(true);

    let res;
    if (values.is_edit) {
      res = await API.put(`/api/redemption/`, { ...values, id: parseInt(redemptiondId) });
    } else {
      res = await API.post(`/api/redemption/`, values);
    }
    const { success, message, data } = res.data;
    if (success) {
      if (values.is_edit) {
        showSuccess('Redemption code updated successfully!');
      } else {
        showSuccess('Redemption code created successfully!');
        if (data.length > 1) {
          let text = '';
          for (let i = 0; i < data.length; i++) {
            text += data[i] + '\n';
          }
          downloadTextAsFile(text, `${values.name}.txt`);
        }
      }
      setSubmitting(false);
      setStatus({ success: true });
      onOk(true);
    } else {
      showError(message);
      setErrors({ submit: message });
    }
  };

  const loadRedemptiond = async () => {
    let res = await API.get(`/api/redemption/${redemptiondId}`);
```{
  success, message, data 
} = res.data;
if (success) {
  data.is_edit = true;
  setInputs(data);
} else {
  showError(message);
}
};

useEffect(() => {
if (redemptiondId) {
  loadRedemptiond().then();
} else {
  setInputs(originInputs);
}
}, [redemptiondId]);

return (
<Dialog open={open} onClose={onCancel} fullWidth maxWidth={'md'}>
<DialogTitle sx={{ margin: '0px', fontWeight: 700, lineHeight: '1.55556', padding: '24px', fontSize: '1.125rem' }}>
{redemptiondId ? 'Edit Redemption Code' : 'Create Redemption Code'}
</DialogTitle>
<Divider />
<DialogContent>
<Formik initialValues={inputs} enableReinitialize validationSchema={validationSchema} onSubmit={submit}>
{({ errors, handleBlur, handleChange, handleSubmit, touched, values, isSubmitting }) => (
<form noValidate onSubmit={handleSubmit}>
<FormControl fullWidth error={Boolean(touched.name && errors.name)} sx={{ ...theme.typography.otherInput }}>
<InputLabel htmlFor="channel-name-label">Name</InputLabel>
<OutlinedInput
id="channel-name-label"
label="Name"
type="text"
value={values.name}
name="name"
onBlur={handleBlur}
onChange={handleChange}
inputProps={{ autoComplete: 'name' }}
aria-describedby="helper-text-channel-name-label"
/>
{touched.name && errors.name && (
<FormHelperText error id="helper-tex-channel-name-label">
{errors.name}
</FormHelperText>
)}
</FormControl>

<FormControl fullWidth error={Boolean(touched.quota && errors.quota)} sx={{ ...theme.typography.otherInput }}>
<InputLabel htmlFor="channel-quota-label">Quota</InputLabel>
<OutlinedInput
id="channel-quota-label"
}"label="Quota"
                  type="number"
                  value={values.quota}
                  name="quota"
                  endAdornment={<InputAdornment position="end">{renderQuotaWithPrompt(values.quota)}</InputAdornment>}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  aria-describedby="helper-text-channel-quota-label"
                  disabled={values.unlimited_quota}
                />

                {touched.quota && errors.quota && (
                  <FormHelperText error id="helper-tex-channel-quota-label">
                    {errors.quota}
                  </FormHelperText>
                )}
              </FormControl>

              {!values.is_edit && (
                <FormControl fullWidth error={Boolean(touched.count && errors.count)} sx={{ ...theme.typography.otherInput }}>
                  <InputLabel htmlFor="channel-count-label">Count</InputLabel>
                  <OutlinedInput
                    id="channel-count-label"
                    label="Count"
                    type="number"
                    value={values.count}
                    name="count"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    aria-describedby="helper-text-channel-count-label"
                  />

                  {touched.count && errors.count && (
                    <FormHelperText error id="helper-tex-channel-count-label">
                      {errors.count}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
              <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button disableElevation disabled={isSubmitting} type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;EditModal.propTypes = {
  open: PropTypes.bool,
  redemptiondId: PropTypes.number,
  onCancel: PropTypes.func,
  onOk: PropTypes.func
};