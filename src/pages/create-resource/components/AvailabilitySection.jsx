import React, { useState } from 'react';
import Input from '../../../components/ui/ui-components/Input';
import Select from '../../../components/ui/ui-components/Select';
import { Checkbox } from '../../../components/ui/ui-components/Checkbox';
import Button from '../../../components/ui/ui-components/Button';
import Icon from '../../../components/ui/AppIcon';

const AvailabilitySection = ({ formData, onChange, errors }) => {
  const [selectedDays, setSelectedDays] = useState(formData?.operatingDays || []);

  const daysOfWeek = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
  ];

  const appointmentOptions = [
    { value: 'required', label: 'Appointment Required', description: 'Must schedule in advance' },
    { value: 'preferred', label: 'Appointment Preferred', description: 'Walk-ins welcome but appointments better' },
    { value: 'walk-in', label: 'Walk-in Only', description: 'No appointments needed' },
    { value: 'both', label: 'Both Available', description: 'Appointments and walk-ins accepted' }
  ];

  const capacityOptions = [
    { value: 'unlimited', label: 'Unlimited' },
    { value: '1-10', label: '1-10 people' },
    { value: '11-25', label: '11-25 people' },
    { value: '26-50', label: '26-50 people' },
    { value: '51-100', label: '51-100 people' },
    { value: '100+', label: '100+ people' }
  ];

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  const handleDayToggle = (dayId) => {
    const updatedDays = selectedDays?.includes(dayId)
      ? selectedDays?.filter(day => day !== dayId)
      : [...selectedDays, dayId];
    
    setSelectedDays(updatedDays);
    handleInputChange('operatingDays', updatedDays);
  };

  const addTimeSlot = () => {
    const currentSlots = formData?.timeSlots || [];
    const newSlot = {
      id: Date.now(),
      startTime: '',
      endTime: '',
      description: ''
    };
    handleInputChange('timeSlots', [...currentSlots, newSlot]);
  };

  const removeTimeSlot = (slotId) => {
    const currentSlots = formData?.timeSlots || [];
    const updatedSlots = currentSlots?.filter(slot => slot?.id !== slotId);
    handleInputChange('timeSlots', updatedSlots);
  };

  const updateTimeSlot = (slotId, field, value) => {
    const currentSlots = formData?.timeSlots || [];
    const updatedSlots = currentSlots?.map(slot =>
      slot?.id === slotId ? { ...slot, [field]: value } : slot
    );
    handleInputChange('timeSlots', updatedSlots);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-semibold text-foreground">Availability & Schedule</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Set your operating hours and availability preferences
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Operating Days <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {daysOfWeek?.map((day) => (
                <Checkbox
                  key={day?.id}
                  label={day?.label}
                  checked={selectedDays?.includes(day?.id)}
                  onChange={() => handleDayToggle(day?.id)}
                />
              ))}
            </div>
            {errors?.operatingDays && (
              <p className="text-sm text-destructive mt-1">{errors?.operatingDays}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-foreground">
                Time Slots
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={addTimeSlot}
                iconName="Plus"
                iconPosition="left"
              >
                Add Time Slot
              </Button>
            </div>

            {formData?.timeSlots && formData?.timeSlots?.length > 0 ? (
              <div className="space-y-3">
                {formData?.timeSlots?.map((slot) => (
                  <div key={slot?.id} className="bg-muted rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Time Slot</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeSlot(slot?.id)}
                        iconName="Trash2"
                        iconSize={14}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Start Time"
                        type="time"
                        value={slot?.startTime}
                        max={slot?.endTime || undefined}
                        onChange={(e) => updateTimeSlot(slot?.id, 'startTime', e?.target?.value)}
                      />
                      <Input
                        label="End Time"
                        type="time"
                        value={slot?.endTime}
                        min={slot?.startTime || undefined}
                        onChange={(e) => updateTimeSlot(slot?.id, 'endTime', e?.target?.value)}
                        error={slot?.startTime && slot?.endTime && slot?.endTime <= slot?.startTime ? 'End time must be after start time' : ''}
                      />
                    </div>
                    <Input
                      label="Description (Optional)"
                      type="text"
                      placeholder="e.g., Morning session, Lunch service"
                      value={slot?.description}
                      onChange={(e) => updateTimeSlot(slot?.id, 'description', e?.target?.value)}
                    />
                  </div>
                ))}
                {errors?.timeSlots && (
                  <p className="text-sm text-destructive">{errors?.timeSlots}</p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted rounded-lg">
                <Icon name="Clock" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-2" />
                <p className="text-muted-foreground">No time slots added yet</p>
                <p className="text-sm text-muted-foreground">Click "Add Time Slot" to get started</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Select
            label="Appointment Requirements"
            placeholder="Select appointment policy"
            options={appointmentOptions}
            value={formData?.appointmentType}
            onChange={(value) => handleInputChange('appointmentType', value)}
            error={errors?.appointmentType}
            required
          />

          <Select
            label="Service Capacity"
            placeholder="Select capacity limit"
            options={capacityOptions}
            value={formData?.capacity}
            onChange={(value) => handleInputChange('capacity', value)}
            error={errors?.capacity}
            required
            description="How many people can you serve at once?"
          />

          <div className="space-y-4">
            <Checkbox
              label="Seasonal Service"
              description="This service is only available during certain seasons"
              checked={formData?.isSeasonal}
              onChange={(e) => handleInputChange('isSeasonal', e?.target?.checked)}
            />

            {formData?.isSeasonal && (
              <div className="bg-accent rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Season Start"
                    type="date"
                    value={formData?.seasonStart}
                    max={formData?.seasonEnd || undefined}
                    onChange={(e) => handleInputChange('seasonStart', e?.target?.value)}
                  />
                  <Input
                    label="Season End"
                    type="date"
                    value={formData?.seasonEnd}
                    min={formData?.seasonStart || undefined}
                    onChange={(e) => handleInputChange('seasonEnd', e?.target?.value)}
                  />
                </div>
                <Input
                  label="Seasonal Notes"
                  type="text"
                  placeholder="e.g., Winter heating assistance, Summer meal program"
                  value={formData?.seasonalNotes}
                  onChange={(e) => handleInputChange('seasonalNotes', e?.target?.value)}
                />
                {errors?.season && (
                  <p className="text-sm text-destructive">{errors?.season}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Special Schedule Notes
            </label>
            <textarea
              className="w-full h-24 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
              placeholder="Holiday closures, special events, temporary schedule changes, etc."
              value={formData?.scheduleNotes}
              onChange={(e) => handleInputChange('scheduleNotes', e?.target?.value)}
            />
          </div>

          <div className="bg-accent rounded-lg p-4">
            <h3 className="font-medium text-accent-foreground mb-2 flex items-center">
              <Icon name="Calendar" size={16} className="mr-2" />
              Scheduling Tips
            </h3>
            <ul className="text-sm text-accent-foreground space-y-1">
              <li>• Be specific about your availability</li>
              <li>• Update schedule changes promptly</li>
              <li>• Consider peak demand times</li>
              <li>• Mention holiday schedules</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilitySection;