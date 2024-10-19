import React, { useState } from 'react';
import Select from 'react-select';

interface FilterProps {
  setFilterStatus: (status: string) => void;
  filterStatus: string;
  show: boolean;
  onClose: () => void;
}

interface Option {
  value: string;
  label: string;
}

const Filter: React.FC<FilterProps> = ({ setFilterStatus, filterStatus, show, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    filterStatus ? { value: filterStatus, label: filterStatus } : null
  );

  if (!show) return null;

  const options: Option[] = [
    { value: 'Selesai', label: 'Selesai' },
    { value: 'Belum Selesai', label: 'Belum Selesai' },
    { value: 'Dalam Progress', label: 'Dalam Progress' }
  ];

  const handleChange = (selected: Option | null) => {
    setSelectedOption(selected);
    setFilterStatus(selected ? selected.value : '');
  };

  const handleClear = () => {
    setSelectedOption(null);
    setFilterStatus('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white dark:bg-gray-900 w-full max-w-sm min-h-[45dvh] h-[45dvh] sm:min-h-[35dvh] sm:h-[35dvh] rounded-lg shadow-xl overflow-hidden relative z-10" >
          <div className="p-4 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filter to-do</h3>
              <Select
                options={options}
                value={selectedOption}
                onChange={handleChange}
                placeholder="Select status"
                className="w-full mb-4"
                classNamePrefix="react-select"
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary: '#3b82f6',
                    primary75: '#60a5fa',
                    primary50: '#93c5fd',
                    primary25: '#bfdbfe',
                    neutral0: 'var(--color-bg)',
                    neutral80: 'var(--color-text)', 
                    neutral20: 'var(--color-border)',
                  },
                })}
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    backgroundColor: 'var(--color-bg)',
                    borderColor: state.isFocused ? '#3b82f6' : 'var(--color-border)',
                    '&:hover': {
                      borderColor: '#3b82f6',
                    },
                    color: 'var(--color-text)',
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected
                      ? '#3b82f6'
                      : state.isFocused
                      ? '#bfdbfe'
                      : 'var(--color-bg)',
                    color: state.isSelected ? 'white' : 'var(--color-text)',
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: 'var(--color-text)',
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: 'var(--color-bg)',
                  }),
                }}
              />
              {selectedOption && (
                <button
                  onClick={handleClear}
                  className="text-sm text-blue-600 hover:text-blue-800 mb-4 block"
                >
                  Clear selection
                </button>
              )}
            </div>
            <div className="mt-auto">
              <button
                type="button"
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;