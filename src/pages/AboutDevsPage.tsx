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

/** The map head, on its side, tucked behind the right edge of the profile. */
function ProfileHead() {
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
              <ProfileHead />
              <div className={styles.stack} aria-hidden="true">
                <span className={styles.stackLayer} />
                <span className={styles.stackLayer} />
                <span className={styles.stackLayer} />
              </div>
              <div className={styles.profile}>
              <div className={styles.identity}>
                <span className={styles.avatar} aria-hidden="true">
                  {profile.name.slice(0, 1)}
                </span>
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
