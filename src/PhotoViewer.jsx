import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Linkedin, Maximize2, X } from "lucide-react";

// A photo that opens bigger. The trigger says so without words: an expand badge that is
// always on screen (touch has no hover), and on hover or focus the frame lifts and the
// image zooms a touch. The viewer is a native <dialog> (top layer, inert page, Esc and
// focus handling come with it). A photo with a `post` opens as a feed-style card: the
// whole photo on the left, the caption and notes on the right.

const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900";
const ease = [0.22, 1, 0.36, 1];
const AUTHOR = "Nishanth G Palaniswami";

const RouteMark = ({ className = "" }) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
    <path d="M8 25 V7 L24 25 V7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="25" r="3.5" strokeWidth="2.5" className="stroke-accent fill-white dark:fill-slate-900" />
    <circle cx="24" cy="7" r="3.5" strokeWidth="2.5" className="stroke-accent fill-white dark:fill-slate-900" />
  </svg>
);

const Avatar = ({ size = "h-8 w-8" }) => (
  <span className={`${size} flex flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900`}>
    <RouteMark className="h-[60%] w-[60%] text-slate-900 dark:text-slate-100" />
  </span>
);

const longDate = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export function PhotoViewer({ photo, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [closing, setClosing] = useState(false);
  const reduce = useReducedMotion();
  const post = photo.post;
  // The parent re-renders while the dialog is open (scroll tracking); keep the latest
  // onClose without re-running the open effect, which would call showModal() twice.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Open as a modal, lock the page scroll without letting the layout jump, and land
  // focus on Close. Every way out (button, backdrop, Esc) ends in the dialog's `close`.
  useEffect(() => {
    const dialog = dialogRef.current;
    const root = document.documentElement;
    const gutter = window.innerWidth - root.clientWidth;
    const prev = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    root.style.overflow = "hidden";
    if (gutter > 0) root.style.paddingRight = `${gutter}px`;
    dialog.showModal();
    closeRef.current?.focus();
    const onCloseEvent = () => {
      root.style.overflow = prev.overflow;
      root.style.paddingRight = prev.paddingRight;
      onCloseRef.current();
    };
    dialog.addEventListener("close", onCloseEvent);
    return () => {
      dialog.removeEventListener("close", onCloseEvent);
      root.style.overflow = prev.overflow;
      root.style.paddingRight = prev.paddingRight;
    };
  }, []);

  const requestClose = () => {
    if (reduce) dialogRef.current?.close();
    else setClosing(true);
  };

  const fade = reduce ? { duration: 0 } : { duration: closing ? 0.15 : 0.2, ease: closing ? "easeIn" : ease };

  return (
    <dialog
      ref={dialogRef}
      aria-label={post ? `${photo.caption}, post` : photo.caption}
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden border-0 bg-transparent p-0 text-slate-900 backdrop:bg-transparent dark:text-slate-100"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-slate-950/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={fade}
      />
      {/* The empty area around the card is the backdrop: a click there closes. */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
        onClick={(e) => {
          if (e.target === e.currentTarget) requestClose();
        }}
      >
        <motion.div
          className={
            post
              ? "flex max-h-full w-full max-w-5xl flex-col overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 md:max-h-[88vh] md:flex-row md:overflow-hidden"
              : "flex max-h-full flex-col items-center"
          }
          initial={{ opacity: 0, scale: 0.98 }}
          animate={closing ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
          transition={fade}
          onAnimationComplete={() => {
            if (closing) dialogRef.current?.close();
          }}
        >
          {post ? (
            <>
              <div className="flex flex-shrink-0 items-center justify-center bg-slate-950 md:min-w-0 md:flex-1">
                <img
                  src={photo.src}
                  width={photo.width}
                  height={photo.height}
                  alt={photo.alt}
                  className="h-auto max-h-[55vh] w-auto max-w-full object-contain md:max-h-[88vh]"
                />
              </div>
              <section className="flex flex-col md:w-[360px] md:flex-shrink-0" aria-label="Post">
                <header className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 pr-14 dark:border-slate-800 md:pr-4">
                  <Avatar />
                  <div className="min-w-0 leading-tight">
                    <p className="truncate text-sm font-semibold">{AUTHOR}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{post.place}</p>
                  </div>
                </header>
                <ol className="space-y-4 px-4 py-4 text-[15px] leading-relaxed md:flex-1 md:overflow-y-auto md:text-sm">
                  {[...post.text, ...(post.notes ?? [])].map((line, i) => (
                    <li key={i} className="flex gap-3">
                      <Avatar size="h-7 w-7" />
                      <p className="min-w-0 text-slate-700 dark:text-slate-300">
                        <span className="mr-1.5 font-semibold text-slate-900 dark:text-slate-100">Nishanth</span>
                        {line}
                      </p>
                    </li>
                  ))}
                </ol>
                {(post.date || post.url) && (
                  <footer className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
                    {post.date ? (
                      <time dateTime={post.date} className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        {longDate(post.date)}
                      </time>
                    ) : (
                      <span />
                    )}
                    {post.url && (
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex min-h-[44px] items-center gap-1.5 rounded text-sm font-medium text-accent hover:underline md:min-h-0 ${ring}`}
                      >
                        <Linkedin className="h-4 w-4" aria-hidden="true" />
                        View on LinkedIn
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    )}
                  </footer>
                )}
              </section>
            </>
          ) : (
            <figure className="flex max-h-full flex-col items-center">
              <img
                src={photo.src}
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                className="h-auto max-h-[calc(100vh-7rem)] w-auto max-w-full rounded-xl object-contain shadow-2xl"
              />
              <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-slate-200">
                {photo.caption}
              </figcaption>
            </figure>
          )}
        </motion.div>
      </div>
      <button
        ref={closeRef}
        type="button"
        onClick={requestClose}
        aria-label="Close"
        className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 md:right-5 md:top-5"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </dialog>
  );
}

// The trigger. `round` is the small circular hobby photo; otherwise a framed photo.
export function PhotoButton({ photo, round = false, className = "", frameClassName = "", imgClassName = "" }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const reduce = useReducedMotion();

  const lift = reduce ? {} : { rest: { y: 0, scale: 1 }, hover: { y: round ? 0 : -2, scale: round ? 1.06 : 1 }, press: { scale: round ? 0.97 : 0.99 } };
  const zoom = reduce || round ? {} : { rest: { scale: 1 }, hover: { scale: 1.04 } };
  const badge = reduce ? {} : { rest: { scale: 1 }, hover: { scale: 1.12 } };

  return (
    <>
      <motion.button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-label={photo.post ? `Open photo and post: ${photo.caption}` : `Enlarge photo: ${photo.caption}`}
        onClick={() => setOpen(true)}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileFocus="hover"
        whileTap="press"
        variants={lift}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`group relative block cursor-zoom-in ${round ? "rounded-full" : "rounded-xl"} ${ring} ${className}`}
      >
        <span
          className={`block overflow-hidden ${frameClassName} ${
            round
              ? "rounded-full"
              : "rounded-xl border border-slate-200 transition-[border-color,box-shadow] duration-200 group-hover:border-slate-300 group-hover:shadow-lg group-hover:shadow-slate-900/10 dark:border-slate-800 dark:group-hover:border-slate-600 dark:group-hover:shadow-black/40"
          }`}
        >
          <motion.img
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            variants={zoom}
            transition={{ duration: 0.35, ease }}
            style={photo.position ? { objectPosition: photo.position } : undefined}
            className={`block w-full object-cover ${imgClassName}`}
          />
        </span>
        <motion.span
          aria-hidden="true"
          variants={badge}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          className={`absolute flex items-center justify-center rounded-full bg-slate-900/75 text-white shadow-sm ring-1 ring-white/20 ${
            round ? "-bottom-0.5 -right-0.5 h-6 w-6" : "bottom-2.5 right-2.5 h-8 w-8"
          }`}
        >
          <Maximize2 className={round ? "h-3 w-3" : "h-3.5 w-3.5"} />
        </motion.span>
      </motion.button>
      {open && (
        <PhotoViewer
          photo={photo}
          onClose={() => {
            setOpen(false);
            buttonRef.current?.focus({ preventScroll: true });
          }}
        />
      )}
    </>
  );
}
