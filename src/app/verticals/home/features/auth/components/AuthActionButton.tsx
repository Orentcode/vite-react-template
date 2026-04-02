import type { ReactNode } from "react";

type AuthActionButtonProps = {
	icon: ReactNode;
	label: string;
	hint: string;
	disabled?: boolean;
	onClick?: () => void;
};

export function AuthActionButton({
	icon,
	label,
	hint,
	disabled,
	onClick,
}: AuthActionButtonProps) {
	return (
		<button className="auth-action-button" type="button" onClick={onClick} disabled={disabled}>
			<span className="auth-action-icon" aria-hidden="true">
				{icon}
			</span>
			<span className="auth-action-copy">
				<span className="auth-action-label">{label}</span>
				<span className="auth-action-hint">{hint}</span>
			</span>
		</button>
	);
}
