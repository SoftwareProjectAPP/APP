import React, { useState } from 'react';
import { Switch, View } from 'react-native';

const SwitchComponent = ()  =>  {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState)
    return(
        <View>
            <Switch
            
            />
        </View>
    )
}