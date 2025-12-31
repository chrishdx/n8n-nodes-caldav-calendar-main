import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CaldavApi implements ICredentialType {
	name = 'caldavApi';
	displayName = 'CalDAV API';
	documentationUrl = 'https://tools.ietf.org/html/rfc4791';
	properties: INodeProperties[] = [
		{
			displayName: 'Server URL',
			name: 'serverUrl',
			type: 'string',
			default: '',
			placeholder: 'https://cal.example.com/caldav/',
			description: 'CalDAV server URL',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
			},
		},
	};

	// CalDAV requires PROPFIND for proper principal discovery
	// Type assertion needed since n8n's IHttpRequestMethods doesn't include WebDAV methods
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.serverUrl}}',
			url: '',
			method: 'PROPFIND' as unknown as 'GET',
			headers: {
				'Content-Type': 'application/xml; charset=utf-8',
				'Depth': '0',
			},
			body: '<?xml version="1.0" encoding="UTF-8"?><d:propfind xmlns:d="DAV:"><d:prop><d:current-user-principal/></d:prop></d:propfind>',
		},
	};
} 