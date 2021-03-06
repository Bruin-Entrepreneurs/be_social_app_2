import React from 'react'
import {
	Text,
	View,
} from 'react-native'
import {
	Avatar,
} from 'react-native-elements'
import {
	Notifications,
} from 'expo'
import { HeaderBackButton } from 'react-navigation'

import storage from '../globals/storage'
import styles from './styles/UserProfileStyle'
import Button from '../components/Button'

export default class Profile extends React.Component {
	static navigationOptions = ({ navigation }) => ({
		headerLeft: <HeaderBackButton
			onPress={() => {
				const { navigate } = navigation
				storage.remove({ key: 'auth' })
				storage.remove({ key: 'user' })
				navigate('Home')
			}}
			title='Log Out'
		/>,
		title: 'Profile'
	})

	constructor(props) {
		super(props);
		this.state = {
			user: false,
			auth: false,
		}
	}

	componentDidMount() {
		this._notificationSubscription = Notifications.addListener(this._handleNotification)

		const auth = storage.load({
			key: 'auth',
		}).then((auth) => this.setState({ auth: auth }))
		const user = storage.load({
			key: 'user',
		}).then((user) => this.setState({ user: user }))
	}

	render() {
		const { navigate } = this.props.navigation

		return (
			<View style={styles.screenContainer} >
				<View style={styles.profileContainer}>
					<Avatar xlarge rounded
						containerStyle={styles.profilePicture}
						overlayContainerStyle={{ backgroundColor: 'transparent' }}
						source={{ uri: !this.state.user ? '' : this.state.user.profile_pic_url }}
					/>
					<View style={styles.profileText}>
						<Text style={styles.profileName}> {!this.state.user ? '' : this.state.user.username} </Text>
					</View>
					<Button half title='Change' onPress={() => navigate('EditProfile')}/>
				</View>
				<Button full title="Make An Event" onPress={() => navigate('TimeSelect')} />
				<Button full title="See Upcoming Events" onPress={() => navigate('Events')} />
			</View>
		)
	}

	_handleNotification = (notification) => {
		const { navigate } = this.props.navigation
		navigate('EventDetail', { id: notification.data.id })
	}
}
