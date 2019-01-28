import React from 'react';
import { View, Animated, Dimensions, Image, Text, Platform, TouchableOpacity, PanResponder } from 'react-native';
import PropTypes from 'prop-types'
import { getStatusBarHeight } from 'react-native-status-bar-height';

const timer = require('react-native-timer');

class InAppPopupNotification extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // Content properties
            title: this.props.title,
            message: this.props.message,
            isAnimating: false,
            iconPath: '',
            isVisible: false,
            opacity: new Animated.Value(this.props.opacity),
            yPos: new Animated.Value(-1 * (this.props.height || (getStatusBarHeight(false) + 100))), 
        }
    }

    // MARK: Rendering methods
    _renderContent() {
        return(
            <Animated.View
                // onPress={this._onPopupPress}
                style={this._styles.content}
                ref={_container => this._container = _container}

                >
                { this._renderIcon() }
                <View
                    style={{flex: 3}}
                >
                    <Text style={this._styles.title}>{this.state.title}</Text>
                    <Text style={this._styles.message}>{this.state.message}</Text>
                </View>
            </Animated.View>
        );
    }

    _renderAnimatedView(){
        return (<Animated.View
        ref = {(_rootView) => this._rootView = _rootView}
        {...this._popupPanResponder.panHandlers}
            style={[this._styles.popup, {
                transform: [{
                    translateY: this.state.yPos,
                },
            ],
            opacity: this.state.opacity,
            }]}
        >
            { this._renderContent() }
        </Animated.View>
        );
    }

    _renderIcon() {
        const iconPath = this.props.iconPath;
        // Loads icon from native resources, to load your icon, add them as an asset in
        // your local iOS/Android project files.
        if (iconPath) {
            const finalUri = `${(Platform.OS === 'ios' ? '' : 'asset:/')}${iconPath}`
            return (<Image style={this._styles.icon} source={{uri: finalUri}}/>)
        } else {
            return null;
        }
    }

    render() {
        if (this.state.isVisible) {
            return this._renderAnimatedView();
        } else {
            return null;
        }
    }

    // MARK: Animations
    _animateViewIn = () => {
        if (this.props.popupWillAppear) {
            this.props.popupWillAppear();
        }
        Animated.timing(
            this.state.yPos,
            {
                toValue: 0,
                duration: this.props.inOutDuration || 5000,
                useNativeDriver: this.props.useNativeDriver,
            }
        ).start(this._animateViewInOnDone);
        this.setState({ isVisible: true, opacity: 1 }, () => {
            timer.setTimeout(this, this.visibleTimerName, this._animateViewOut, this.props.showDuration + this.props.inOutDuration);
        });
    }

    _animateViewOut = (callback) => {
        this.setState({ isAnimating: true, opacity: this.props.opacity });
        if (this.props.popupWillDisappear) {
            this.props.popupWillDisappear();
        }
        Animated.timing(
            this.state.yPos,
            {
                toValue: -1 * (this.props.height || (getStatusBarHeight(false) + 100)),
                duration: this.props.inOutDuration || 5000,
                useNativeDriver: this.props.useNativeDriver,
            }
        ).start(() => this._animateViewOutOnDone(callback));
    }

    _setOpacityAsSelected() {
        this.setState({ opacity: 0.3 * this.props.opacity });
    }

    _setOpacityAsUnselected() {
        this.setState({ opacity: this.props.opacity });
    }

    // MARK: Callbacks
    _onPopupPress = () => {
        if (this.props.popupWasClicked) {
            this.dismissPopup();
            this.props.popupWasClicked();
        }
    }

    _animateViewOutOnDone = (callback) => {
        this.setState({ isVisible: false, isAnimating: false })
        if (this.props.popupDidDisappear){
            this.props.popupDidDisappear();
        }
        if (callback && typeof(callback) === 'function') {
            callback();
        }
    }

    _animateViewInOnDone = () => {
        this.setState({ isAnimating: false});
        if (this.props.popupDidAppear) {
            this.props.popupDidAppear();
        }
        console.log(this._container.props.style);
    }

    // MARK: Pan Responder - See https://facebook.github.io/react-native/docs/panresponder
    _popupPanResponder = PanResponder.create({
        onStartShouldSetPanResponder: (event, gestureState) => true,
        onStartShouldSetPanResponderCapture: (event, gestureState) => true,
        onMoveShouldSetPanResponder: (event, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (event, gestureState) => true,
        onPanResponderGrant: (event, gestureState) => {
            this._totalDistanceTravelled = 0;
            this._setOpacityAsSelected();
        },
        onPanResponderMove: (event, gestureState) => {
            this._containerBottom = -1 * gestureState.dy;
            if (this._containerBottom < 0) {
                this._containerBottom = 0;
            }
            this._container.setNativeProps({
                bottom: this._containerBottom,
            });
            this._totalDistanceTravelled += Math.abs(gestureState.dy);
        },
        onPanResponderTerminationRequest: (event, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) => {
            this._onPanRelease(evt, gestureState);
          },
          onPanResponderTerminate: (evt, gestureState) => {
            this._onPanRelease(evt, gestureState);
          },
        onShouldBlockNativeResponder: (event, gestureState) => true,
    });
    
    // Handles when the pan is released, either by the user or another component 
    _onPanRelease = (evt, gestureState) => {
        console.log(`Release: ${gestureState.dy}`);

        // The threshold for counting a swipe as a dismiss is 20% of the height
        if (this._containerBottom >= this.props.height * 0.20){
            this.dismissPopup();
        } else if (this._totalDistanceTravelled <= this.props.height * 0.02) {
            // Press threshold
            this._onPopupPress();
        }
         else {
            // If this threshold is not met, reset the event
            this._setOpacityAsUnselected();
            this._container.setNativeProps({
                bottom: 0,
            });
        }
    };

    // MARK: API Methods - these will be visible to the user
    displayNotification(parameters) {
        // Only one popup can be displayed at a time
        if (this.state.isAnimating || this.state.isVisible) {
            console.warn('Could not display popup because one is already being displayed.');
            return;
        }
        // Set state
        this.setState({
            title: parameters.title || '',
            message: parameters.message || '',
            iconPath: '',
        });
        this._animateViewIn(this.props.popupDidAppear);
    }

    dismissPopup(callback) {
        if (timer.timeoutExists(this, this.visibleTimerName)) {
            timer.clearTimeout(this, this.visibleTimerName);
            this._animateViewOut(callback);
        } else {
            console.warn('No popup to clear.');
        }
    }

    // MARK: Styles
    _styles = {
        popup: {
            position: 'absolute',
            height: this.props.height,
            top: -1 * getStatusBarHeight(false),
        },
        content: {
            height: this.props.height - 10,
            backgroundColor: this.props.backgroundColor,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: 10,
            paddingTop: getStatusBarHeight(false) + 10,
            width: Dimensions.get('window').width,
            borderRadius: 10,
            bottom: 0,
            opacity: this.props.opacity,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,  
            elevation: 5
        },
        icon: {
            // TODO: Make these properties dependent on the height
            width: 50,
            height: 50,
        }, 
        title: {
            marginLeft: 10,
            marginRight: 10,
            color: this.props.titleColor,
            fontFamily: this.props.titleFont,
            fontWeight: '900',
            fontSize: 18,
        },
        message: {
            marginLeft: 10,
            marginRight: 10,
            color: this.props.messageColor,
            fontFamily: this.props.messageFont,
        }
    };

    // MARK: Constants or variables
    _containerBottom = 0;
    _totalDistanceTravelled = 0;
    visibleTimerName = 'popup_visible_timer';

    // MARK: Props
    static propTypes = {
        // Content properties
        title: PropTypes.string,
        message: PropTypes.string,
        iconPath: PropTypes.string,
        // Styling properties
        backgroundColor: PropTypes.string,
        titleColor: PropTypes.string,
        titleFont: PropTypes.string,
        messageColor: PropTypes.string,
        messageFont: PropTypes.string,
        height: PropTypes.number,
        // Timing properties
        inOutDuration: PropTypes.number,
        showDuration: PropTypes.number,
        // Callback properties
        notificationWasClicked: PropTypes.func,
        popupDidAppear: PropTypes.func,
        popupDidDisappear: PropTypes.func,
        popupWillAppear: PropTypes.func,
        popupWillDisappear: PropTypes.func,
        // Misc.
        isVisible: PropTypes.bool,
        useNativeDriver: PropTypes.bool,
    };

    static defaultProps = {
        title: 'Congratulations!',
        message: 'You got notified!',
        iconPath: null,
        backgroundColor: '#FFF',
        titleColor: '#000',
        titleFont: 'system font',
        messageColor: '#000',
        messageFont: 'system font',
        opacity: 1,
        height: getStatusBarHeight(false) + 90,
        inOutDuration: 500, // in ms
        showDuration: 5000,
        popupWasClicked: () => {},
        popupDidAppear: () => {},
        popupDidDisappear: () => {},
        popupWillAppear: () => {},
        popupWillDisappear: () => {},
        isVisible: false,
        useNativeDriver: false,
    };
}
export default InAppPopupNotification;
