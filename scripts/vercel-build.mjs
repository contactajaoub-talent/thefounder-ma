import {spawnSync} from 'node:child_process';

// Deployment-level guard: the current redesign is approved for Preview only.
// This does not alter project settings, domains, Git configuration or production.
const environment = process.env.VERCEL_TARGET_ENV || process.env.VERCEL_ENV;
if (environment !== 'preview') throw new Error('Déploiement refusé : cette branche est autorisée uniquement en Preview Vercel.');
if (process.env.VERCEL_PROJECT_NAME && process.env.VERCEL_PROJECT_NAME !== 'thefounder-ma-pcwy') throw new Error('Projet Vercel inattendu : vérifier la cible avant tout déploiement.');
if (process.env.VERCEL_GIT_COMMIT_REF === 'main') throw new Error('Déploiement refusé depuis main : utiliser la branche de refonte.');
const result = spawnSync(process.execPath,['scripts/build.mjs'], {stdio:'inherit',env:process.env});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
