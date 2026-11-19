import { explorerCopy } from "../content";
import SiteFrame from "../components/SiteFrame";
import styles from "./AboutDevsPage.module.css";

type ProfileLink = (typeof explorerCopy.aboutPage.profiles)[number]["links"][number];

function ProfileIcon({ id }: { id: ProfileLink["id"] }) {
  const common = {
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
    className: styles.icon,
  };

  if (id === "x") {
    return (
      <svg {...common}>
        <path
          fill="currentColor"
          d="M14.7 10.4 21.4 3h-1.6l-5.8 6.4L9.2 3H3.4l7 9.9L3.4 21h1.6l6.2-6.8L14.8 21h5.8l-7.3-10.6Zm-2.2 2.4-.7-1-5.7-7.9h2.4l4.6 6.4.7 1 6 8.3h-2.4l-4.9-6.8Z"
        />
      </svg>
    );
  }

  if (id === "linkedin") {
    return (
      <svg {...common}>
        <path
          fill="currentColor"
          d="M4.7 3.4a1.9 1.9 0 1 1-3.8 0 1.9 1.9 0 0 1 3.8 0ZM1.2 8.2h3.6V21H1.2V8.2Zm6.2 0h3.4v1.8h.1c.5-1 1.7-2 3.5-2 3.7 0 4.4 2.4 4.4 5.6V21h-3.6v-6.3c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V21H7.4V8.2Z"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path
        fill="currentColor"
        d="M12 2.2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.6s.8-.3 2.8 1a9.6 9.6 0 0 1 5.1 0c2-.1 2.8-1 2.8-1a3.6 3.6 0 0 1 .1 2.6 3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2.2Z"
      />
    </svg>
  );
}

function FastAPILogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" className={className} aria-label="FastAPI Logo">
      <circle cx="128" cy="128" r="128" fill="#009688" />
      <path
        fill="#FFFFFF"
        d="M121.33 230.605v-80.288H76.699l64.128-124.922v80.288h42.966z"
      />
    </svg>
  );
}

function PythonLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-label="Python Logo">
      <defs>
        <linearGradient id="py-blue" x1="16" y1="16" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#387EB8" />
          <stop offset="100%" stopColor="#366994" />
        </linearGradient>
        <linearGradient id="py-yellow" x1="24" y1="24" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE052" />
          <stop offset="100%" stopColor="#FFC331" />
        </linearGradient>
      </defs>
      <path
        fill="url(#py-blue)"
        d="M31.885 16c-8.124 0-7.617 3.523-7.617 3.523l.01 3.65h7.752v1.095H21.197S16 23.678 16 31.876c0 8.196 4.537 7.906 4.537 7.906h2.708v-3.804s-.146-4.537 4.465-4.537h7.688s4.32.07 4.32-4.175v-7.019S40.374 16 31.885 16zm-4.275 2.454a1.394 1.394 0 1 1 0 2.79 1.393 1.393 0 0 1-1.395-1.395c0-.771.624-1.395 1.395-1.395z"
      />
      <path
        fill="url(#py-yellow)"
        d="M32.115 47.833c8.124 0 7.617-3.523 7.617-3.523l-.01-3.65H31.97v-1.095h10.832S48 40.155 48 31.958c0-8.197-4.537-7.906-4.537-7.906h-2.708v3.803s.146 4.537-4.465 4.537h-7.688s-4.32-.07-4.32 4.175v7.019s-.656 4.247 7.833 4.247zm4.275-2.454a1.393 1.393 0 0 1-1.395-1.395 1.394 1.394 0 1 1 1.395 1.395z"
      />
    </svg>
  );
}

function ReactLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="-11.5 -10.23174 23 20.46348" className={className} aria-label="React Logo">
      <circle cx="0" cy="0" r="2.05" fill="#00D8FF" />
      <g stroke="#00D8FF" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

function TypeScriptLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" className={className} aria-label="TypeScript Logo">
      <path
        fill="#3178C6"
        d="M20 0h216c11.046 0 20 8.954 20 20v216c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V20C0 8.954 8.954 0 20 0z"
      />
      <path
        fill="#FFFFFF"
        d="M150.518 200.475v27.62q6.738 3.453 15.938 5.179T185.849 235q9.934 0 18.874-1.899t15.678-6.257q6.738-4.359 10.669-11.394q3.93-7.033 3.93-17.391q0-7.51-2.246-13.163a30.8 30.8 0 0 0-6.479-10.055q-4.232-4.402-10.149-7.898t-13.347-6.602q-5.442-2.245-9.761-4.359t-7.342-4.316q-3.024-2.2-4.665-4.661t-1.641-5.567q0-2.848 1.468-5.135q1.469-2.288 4.147-3.927t6.565-2.547q3.887-.906 8.638-.906q3.456 0 7.299.518q3.844.517 7.732 1.597a54 54 0 0 1 7.558 2.719a41.7 41.7 0 0 1 6.781 3.797v-25.807q-6.306-2.417-13.778-3.582T198.633 107q-9.847 0-18.658 2.115q-8.811 2.114-15.506 6.602q-6.694 4.49-10.582 11.437Q150 134.102 150 143.769q0 12.342 7.127 21.06t21.638 14.759a292 292 0 0 1 10.625 4.575q4.924 2.244 8.509 4.66t5.658 5.265t2.073 6.474a9.9 9.9 0 0 1-1.296 4.963q-1.295 2.287-3.93 3.97t-6.565 2.632t-9.2.95q-8.983 0-17.794-3.151t-16.327-9.451m-46.036-68.733H140V109H41v22.742h35.345V233h28.137z"
      />
    </svg>
  );
}

function TechIcon({ id }: { id: string }) {
  if (id === "fastapi") return <FastAPILogo className={styles.stackSvg} />;
  if (id === "python") return <PythonLogo className={styles.stackSvg} />;
  if (id === "react") return <ReactLogo className={styles.stackSvg} />;
  return <TypeScriptLogo className={styles.stackSvg} />;
}

function TentacleArm({ variant }: { variant: number }) {
  if (variant === 0) {
    return (
      <svg
        viewBox="0 0 100 68"
        fill="none"
        className={styles.tentacleSvg}
        aria-hidden="true"
      >
        <path
          d="M0 44 C26 44 42 56 64 54 C82 52 94 40 90 22 C86 8 72 10 66 20"
          stroke="var(--head-shadow)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0 44 C26 44 42 56 64 54 C82 52 94 40 90 22 C86 8 72 10 66 20"
          stroke="var(--head-body)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 38 C28 38 42 48 64 46"
          stroke="var(--head-shine)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="20" cy="54" r="4.5" fill="var(--head-blush)" stroke="var(--head-shadow)" strokeWidth="1.5" />
        <circle cx="42" cy="62" r="5" fill="var(--head-blush)" stroke="var(--head-shadow)" strokeWidth="1.5" />
        <circle cx="66" cy="59" r="4.5" fill="var(--head-blush)" stroke="var(--head-shadow)" strokeWidth="1.5" />
        <circle cx="84" cy="44" r="4" fill="var(--head-blush)" stroke="var(--head-shadow)" strokeWidth="1.5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 68"
      fill="none"
      className={styles.tentacleSvg}
      aria-hidden="true"
    >
      <path
        d="M0 24 C26 24 42 12 64 14 C82 16 94 28 90 46 C86 60 72 58 66 48"
        stroke="var(--head-shadow)"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0 24 C26 24 42 12 64 14 C82 16 94 28 90 46 C86 60 72 58 66 48"
        stroke="var(--head-body)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 30 C28 30 42 20 64 22"
        stroke="var(--head-shine)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="20" cy="14" r="4.5" fill="var(--head-blush)" stroke="var(--head-shadow)" strokeWidth="1.5" />
      <circle cx="42" cy="6" r="5" fill="var(--head-blush)" stroke="var(--head-shadow)" strokeWidth="1.5" />
      <circle cx="66" cy="9" r="4.5" fill="var(--head-blush)" stroke="var(--head-shadow)" strokeWidth="1.5" />
      <circle cx="84" cy="24" r="4" fill="var(--head-blush)" stroke="var(--head-shadow)" strokeWidth="1.5" />
    </svg>
  );
}

/** The map head, on its side, tucked behind the right edge of the profile. */
function ProfileHead({ tone }: { tone: "blue" | "pink" }) {
  return (
    <span className={styles.head} aria-hidden="true">
        <svg viewBox="568 8 210 228" fill="none" aria-hidden="true">
          <path
            className={styles.headShadow}
            d="M580 134.4C580 63.6235 610.667 28.2353 672 28.2353C733.333 28.2353 764 63.6235 764 134.4L754 195.388C751.333 219.482 740 228.518 720 222.494L692 211.2C678.667 225.506 665.333 225.506 652 211.2L624 222.494C602.667 228.518 590.667 219.482 588 195.388L580 134.4Z"
          />
          <path
            className={styles.headBody}
            d="M580 124.235C580 53.4588 610.667 18.0706 672 18.0706C733.333 18.0706 764 53.4588 764 124.235L754 185.224C751.333 209.318 740 218.353 720 212.329L692 201.035C678.667 215.341 665.333 215.341 652 201.035L624 212.329C602.667 218.353 590.667 209.318 588 185.224L580 124.235Z"
          />
          <path
            className={styles.headShine}
            d="M610 63.247C626 43.6706 642.667 36.8941 660 42.9176"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path
            d="M635 159.247C650.464 159.247 663 141.043 663 118.588C663 96.133 650.464 77.9294 635 77.9294C619.536 77.9294 607 96.133 607 118.588C607 141.043 619.536 159.247 635 159.247Z"
            fill="white"
          />
          <path
            d="M705 159.247C720.464 159.247 733 141.043 733 118.588C733 96.133 720.464 77.9294 705 77.9294C689.536 77.9294 677 96.133 677 118.588C677 141.043 689.536 159.247 705 159.247Z"
            fill="white"
          />
          <path
            d="M643 149.082C650.18 149.082 656 138.464 656 125.365C656 112.266 650.18 101.647 643 101.647C635.82 101.647 630 112.266 630 125.365C630 138.464 635.82 149.082 643 149.082Z"
            fill="#352056"
          />
          <path
            d="M697 149.082C704.18 149.082 710 138.464 710 125.365C710 112.266 704.18 101.647 697 101.647C689.82 101.647 684 112.266 684 125.365C684 138.464 689.82 149.082 697 149.082Z"
            fill="#352056"
          />
          <path
            d="M647 120.847C649.761 120.847 652 118.319 652 115.2C652 112.081 649.761 109.553 647 109.553C644.239 109.553 642 112.081 642 115.2C642 118.319 644.239 120.847 647 120.847Z"
            fill="white"
          />
          <path
            d="M701 120.847C703.761 120.847 706 118.319 706 115.2C706 112.081 703.761 109.553 701 109.553C698.239 109.553 696 112.081 696 115.2C696 118.319 698.239 120.847 701 120.847Z"
            fill="white"
          />
          <path
            className={styles.headBlush}
            d="M611 170.541C619.284 170.541 626 166.496 626 161.506C626 156.516 619.284 152.471 611 152.471C602.716 152.471 596 156.516 596 161.506C596 166.496 602.716 170.541 611 170.541Z"
          />
          <path
            className={styles.headBlush}
            d="M732 170.541C740.284 170.541 747 166.496 747 161.506C747 156.516 740.284 152.471 732 152.471C723.716 152.471 717 156.516 717 161.506C717 166.496 723.716 170.541 732 170.541Z"
          />
          <path
            className={styles.headMouth}
            d="M650 168.282C664.667 189.365 679.333 189.365 694 168.282H650Z"
          />
          <path
            className={styles.headTongue}
            d="M661 181.835C668.333 175.812 676 176.188 684 182.965C676 188.988 668.333 188.612 661 181.835Z"
          />

          {/* Tone-specific accessories */}
          {tone === "blue" ? (
            /* Glasses for the blue octopus */
            <g aria-label="Glasses">
              <ellipse
                cx="635"
                cy="122"
                rx="23"
                ry="25"
                stroke="#12284c"
                strokeWidth="4"
                fill="rgba(215, 236, 255, 0.22)"
              />
              <path
                d="M623 108 L645 108"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.8"
              />
              <ellipse
                cx="705"
                cy="122"
                rx="23"
                ry="25"
                stroke="#12284c"
                strokeWidth="4"
                fill="rgba(215, 236, 255, 0.22)"
              />
              <path
                d="M693 108 L715 108"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.8"
              />
              <path
                d="M658 119 C664 113 676 113 682 119"
                stroke="#12284c"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M612 120 L588 116"
                stroke="#12284c"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M728 120 L752 116"
                stroke="#12284c"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          ) : (
            /* Long, curled eyelashes for the pink octopus */
            <g aria-label="Curled eyelashes">
              {/* Left eye eyeliner & curled lashes */}
              <path
                d="M611 95 C621 78 649 78 659 95"
                stroke="#352056"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M614 88 C606 80 598 66 604 54 C606 50 610 52 609 56"
                stroke="#352056"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M627 80 C623 68 620 52 628 42 C630 38 634 40 632 45"
                stroke="#352056"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M643 80 C645 70 650 56 658 48 C660 46 663 48 661 51"
                stroke="#352056"
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />

              {/* Right eye eyeliner & curled lashes */}
              <path
                d="M681 95 C691 78 719 78 729 95"
                stroke="#352056"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M697 80 C695 70 690 56 682 48 C680 46 677 48 679 51"
                stroke="#352056"
                strokeWidth="2.6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M713 80 C717 68 720 52 712 42 C710 38 706 40 708 45"
                stroke="#352056"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M726 88 C734 80 742 66 736 54 C734 50 730 52 731 56"
                stroke="#352056"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}
        </svg>
    </span>
  );
}

/** Two developer profiles, each with GitHub, X, and LinkedIn. */
export default function AboutDevsPage() {
  const { eyebrow, title, subtitle, profiles } = explorerCopy.aboutPage;

  return (
    <SiteFrame>
      <section className={styles.section} aria-labelledby="about-devs-heading">
        <header className={styles.intro}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 id="about-devs-heading">{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>
        <ul className={styles.profiles}>
          {profiles.map((profile, index) => (
            <li
              key={profile.name}
              className={styles.slot}
              data-tone={index === 0 ? "blue" : "pink"}
            >
              <ProfileHead tone={index === 0 ? "blue" : "pink"} />
              <div
                className={styles.stackDrawer}
                aria-label={`${profile.name} tech stack`}
              >
                {profile.stack.map((item, idx) => (
                  <div
                    key={item.id}
                    className={styles.tentacleRow}
                    data-tech={item.id}
                  >
                    <div className={styles.tentacleArm} aria-hidden="true">
                      <TentacleArm variant={idx} />
                    </div>
                    <span
                      className={styles.logoBadge}
                      title={item.name}
                      aria-label={item.name}
                    >
                      <TechIcon id={item.id} />
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.profile}>
              <div className={styles.identity}>
                <img
                  className={styles.avatar}
                  src={index === 0 ? "/boy.jpg" : "/girl.jpg"}
                  alt={`${profile.name} avatar`}
                />
                <div>
                  <h2>{profile.name}</h2>
                  <p className={styles.role}>{profile.role}</p>
                </div>
              </div>
              <p className={styles.focus}>{profile.focus}</p>
              <dl className={styles.details}>
                {profile.details.map((detail) => (
                  <div key={detail.label}>
                    <dt>{detail.label}</dt>
                    <dd>{detail.value}</dd>
                  </div>
                ))}
              </dl>
              <ul className={styles.links}>
                {profile.links.map((link) => {
                  const icon = <ProfileIcon id={link.id} />;
                  if (!link.href) {
                    return (
                      <li key={link.id}>
                        <button
                          type="button"
                          className={styles.link}
                          data-network={link.id}
                          title={`${link.label} — add the URL in content.ts`}
                          aria-label={link.label}
                        >
                          {icon}
                          <span>{link.label}</span>
                        </button>
                      </li>
                    );
                  }
                  return (
                    <li key={link.id}>
                      <a
                        className={styles.link}
                        data-network={link.id}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {icon}
                        <span>{link.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </SiteFrame>
  );
}
