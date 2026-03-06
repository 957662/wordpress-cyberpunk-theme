#!/bin/bash

# CyberPress Frontend Deployment Script
# This script handles the deployment of the Next.js frontend application

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="CyberPress Frontend"
BUILD_DIR=".next"
DEPLOY_DIR="/var/www/cyberpress"
BACKUP_DIR="/var/backups/cyberpress"
LOG_FILE="deployment.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} ✓ $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} ✗ $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} ⚠ $1" | tee -a "$LOG_FILE"
}

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

check_environment() {
    print_header "Checking Environment"

    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    log_success "Node.js $(node -v) found"

    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    log_success "npm $(npm -v) found"

    # Check .env.local
    if [ ! -f ".env.local" ]; then
        log_warning ".env.local not found, copying from .env.example"
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            log_warning "Please configure .env.local with your settings"
        else
            log_error "No .env.example found"
            exit 1
        fi
    else
        log_success ".env.local found"
    fi
}

install_dependencies() {
    print_header "Installing Dependencies"

    if [ -d "node_modules" ]; then
        log_warning "node_modules exists, skipping npm install"
        log_warning "Run 'rm -rf node_modules' to force reinstall"
    else
        log "Installing dependencies..."
        if npm install; then
            log_success "Dependencies installed"
        else
            log_error "Failed to install dependencies"
            exit 1
        fi
    fi
}

run_tests() {
    print_header "Running Tests"

    if [ "$SKIP_TESTS" = "true" ]; then
        log_warning "Skipping tests (SKIP_TESTS=true)"
        return
    fi

    log "Running type check..."
    if npm run type-check; then
        log_success "Type check passed"
    else
        log_error "Type check failed"
        exit 1
    fi

    log "Running linter..."
    if npm run lint; then
        log_success "Linting passed"
    else
        log_warning "Linting found issues (continuing)"
    fi
}

build_application() {
    print_header "Building Application"

    log "Creating production build..."
    if npm run build; then
        log_success "Build completed successfully"
    else
        log_error "Build failed"
        exit 1
    fi

    # Check if build directory exists
    if [ ! -d "$BUILD_DIR" ]; then
        log_error "Build directory not found"
        exit 1
    fi

    log_success "Build artifacts ready"
}

backup_deployment() {
    print_header "Backing Up Current Deployment"

    if [ ! -d "$DEPLOY_DIR" ]; then
        log_warning "No existing deployment to backup"
        return
    fi

    # Create backup directory if it doesn't exist
    sudo mkdir -p "$BACKUP_DIR"

    BACKUP_FILE="$BACKUP_DIR/cyberpress-frontend-$(date +%Y%m%d-%H%M%S).tar.gz"

    log "Creating backup: $BACKUP_FILE"
    if sudo tar -czf "$BACKUP_FILE" -C "$DEPLOY_DIR" . 2>/dev/null; then
        log_success "Backup created successfully"

        # Keep only last 5 backups
        log "Cleaning old backups..."
        sudo ls -t "$BACKUP_DIR"/cyberpress-frontend-*.tar.gz | tail -n +6 | xargs -r sudo rm
        log_success "Old backups cleaned"
    else
        log_error "Failed to create backup"
        exit 1
    fi
}

deploy_to_server() {
    print_header "Deploying to Server"

    # Create deployment directory if it doesn't exist
    sudo mkdir -p "$DEPLOY_DIR"

    log "Stopping application..."
    if sudo systemctl stop cyberpress-frontend 2>/dev/null; then
        log_success "Application stopped"
    else
        log_warning "Failed to stop application (may not be running)"
    fi

    log "Copying files to deployment directory..."
    if sudo rsync -av --delete \
        --exclude 'node_modules' \
        --exclude '.next' \
        --exclude '.git' \
        --exclude '*.log' \
        . "$DEPLOY_DIR/"; then
        log_success "Files copied successfully"
    else
        log_error "Failed to copy files"
        exit 1
    fi

    log "Setting permissions..."
    sudo chown -R www-data:www-data "$DEPLOY_DIR"
    sudo chmod -R 755 "$DEPLOY_DIR"
    log_success "Permissions set"

    log "Starting application..."
    if sudo systemctl start cyberpress-frontend; then
        log_success "Application started"
    else
        log_error "Failed to start application"
        exit 1
    fi

    log_success "Application is running"
}

verify_deployment() {
    print_header "Verifying Deployment"

    # Wait for application to start
    log "Waiting for application to start..."
    sleep 5

    # Check if service is running
    if sudo systemctl is-active --quiet cyberpress-frontend; then
        log_success "Service is running"
    else
        log_error "Service is not running"
        exit 1
    fi

    # Check HTTP response (if configured)
    if command -v curl &> /dev/null; then
        log "Checking HTTP response..."
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
            log_success "Application is responding"
        else
            log_warning "Application may not be responding correctly"
        fi
    fi
}

cleanup() {
    print_header "Cleanup"

    log "Removing old logs..."
    find . -name "*.log" -mtime +7 -delete 2>/dev/null || true
    log_success "Cleanup completed"
}

show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help              Show this help message"
    echo "  -s, --skip-tests        Skip running tests"
    echo "  -b, --build-only        Only build, don't deploy"
    echo "  -d, --deploy-only       Only deploy, don't build"
    echo "  --no-backup             Skip backup before deployment"
    echo ""
    echo "Examples:"
    echo "  $0                      # Full deployment"
    echo "  $0 -s                   # Skip tests"
    echo "  $0 -b                   # Build only"
    echo "  $0 -d                   # Deploy only"
}

# Main execution
main() {
    local SKIP_TESTS=false
    local BUILD_ONLY=false
    local DEPLOY_ONLY=false
    local NO_BACKUP=false

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_usage
                exit 0
                ;;
            -s|--skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            -b|--build-only)
                BUILD_ONLY=true
                shift
                ;;
            -d|--deploy-only)
                DEPLOY_ONLY=true
                shift
                ;;
            --no-backup)
                NO_BACKUP=true
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done

    print_header "$APP_NAME Deployment"

    if [ "$DEPLOY_ONLY" = false ]; then
        check_environment
        install_dependencies
        run_tests
        build_application
    fi

    if [ "$BUILD_ONLY" = true ]; then
        log_success "Build completed. Deployment skipped."
        exit 0
    fi

    if [ "$NO_BACKUP" = false ]; then
        backup_deployment
    fi

    deploy_to_server
    verify_deployment
    cleanup

    print_header "Deployment Completed Successfully"
    log_success "The application has been deployed and is running"
    echo ""
}

# Run main function
main "$@"
