type PhoneLoginFormProps = {
	phoneNumber: string;
	passcode: string;
	isCodeSent: boolean;
	onPhoneNumberChange: (value: string) => void;
	onPasscodeChange: (value: string) => void;
	onRequestCode: () => void;
	onVerifyCode: () => void;
};

export function PhoneLoginForm({
	phoneNumber,
	passcode,
	isCodeSent,
	onPhoneNumberChange,
	onPasscodeChange,
	onRequestCode,
	onVerifyCode,
}: PhoneLoginFormProps) {
	return (
		<div className="phone-auth-card">
			<div className="phone-auth-header">
				<h2>Use your phone number</h2>
				<p>
					We&apos;ll text you a 6-digit passcode so you can sign in without a
					password.
				</p>
			</div>
			<label className="auth-field">
				<span>Phone number</span>
				<input
					autoComplete="tel"
					inputMode="tel"
					placeholder="(555) 123-4567"
					value={phoneNumber}
					onChange={(event) => onPhoneNumberChange(event.target.value)}
				/>
			</label>
			{isCodeSent ? (
				<label className="auth-field">
					<span>Passcode</span>
					<input
						autoComplete="one-time-code"
						inputMode="numeric"
						maxLength={6}
						placeholder="123456"
						value={passcode}
						onChange={(event) => onPasscodeChange(event.target.value)}
					/>
				</label>
			) : null}
			<div className="phone-auth-actions">
				{isCodeSent ? (
					<button className="phone-auth-primary" type="button" onClick={onVerifyCode}>
						Verify and continue
					</button>
				) : (
					<button className="phone-auth-primary" type="button" onClick={onRequestCode}>
						Send passcode
					</button>
				)}
				{isCodeSent && (
					<button className="phone-auth-secondary" type="button" onClick={onRequestCode}>
						Resend code
					</button>
				)}
			</div>
		</div>
	);
}
